import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {InputComponent} from "../../components/input/input.component";
import {UserCardComponent} from "../../components/user-card/user-card.component";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {UserService} from "../../../architecture/services/UserService";
import {User} from "../../../architecture/model/User";
import {MessageService} from "../../../architecture/services/MessageService";
import {AuthService} from "../../services/auth.service";
import {Message} from "../../../architecture/model/Message";
import {MessageComponent} from "../../components/message/message.component";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Notify} from "../../services/notify";

@Component({
    selector: 'app-messages',
    imports: [
        InputComponent,
        UserCardComponent,
        MessageComponent
    ],
    templateUrl: './messages.component.html',
    standalone: true,
    styleUrl: './messages.component.css'
})
export class MessagesComponent {
    @ViewChild('withScroll') private withScroll!: ElementRef;
    @ViewChildren('item') private itemsElements!: QueryList<ElementRef>;

    protected users: User[] = [];
    protected messages: {[key: string]: Message} = {};
    protected recipientID: string | null = null;
    protected recipient: User | null = null;

    protected paramsSubscription: Subscription | null = null;
    protected recipientSubscription: Subscription | null = null;
    protected friendsSubscription: Subscription | null = null;
    protected messagesSubscription: Subscription | null = null;
    protected socketSubscriptions : Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        protected router: Router,
        protected serviceFactory: ServiceFactory,
        private sockets: WebSocketFactory,
        protected auth: AuthService,
        protected notify: Notify
    ) {
    }

    ngOnInit() {
        this.paramsSubscription = this.route.paramMap.subscribe(params => {
            this.restart();
            this.recipientID = params.get('id');
            if (this.recipientID)
                this.recipientSubscription = (this.serviceFactory.get('users') as UserService).getUser(this.recipientID).subscribe(res => {
                    this.recipient = res.data[0];
                    this.initializeSocketsListeners();
                });
            this.friendsSubscription = (this.serviceFactory.get('users') as UserService).getFriends(this.auth.getUserUUID()).subscribe(res => {
                this.users = [...res.data];
                this.messagesSubscription = (this.serviceFactory.get('messages') as MessageService).getBetween(this.auth.getUserUUID(), this.recipientID!).subscribe(res => {
                    res.data.forEach(m => this.messages[m.id!] = m);
                    this.markAsRead(Object.values(this.messages));
                });
            });
        });
    }

    restart() {
        this.messages = {};
        this.recipientID = null;
        this.recipient = null;
        if (this.recipientSubscription) this.recipientSubscription?.unsubscribe();
        if (this.friendsSubscription) this.friendsSubscription?.unsubscribe();
        if (this.messagesSubscription) this.messagesSubscription?.unsubscribe();
        this.socketSubscriptions.forEach(s => s.unsubscribe());
    }

    ngOnDestroy() {
        this.restart();
    }

    send(body: string) {
        const message: Message = {
            from: this.auth.getUserUUID(),
            to: this.recipientID!,
            body: encodeURIComponent(body),
            isRead: false,
            created_at: new Date().toISOString()
        };
        (this.serviceFactory.get('messages') as MessageService).send(message).subscribe();
        this.scrollToBottom();
    }

    removeMessage(id: string) {
        this.notify.confirm('Do you want to remove this messsage?').then(confirm => {
            if (confirm) (this.serviceFactory.get('messages') as MessageService).delete(id).subscribe({
                next: () => this.notify.success('This message has been removed'),
                error: err => this.notify.error(`We could not remove this message: ${err.error}`)
            });
            else this.notify.error('This message is still safe', 'Operation cancelled');
        });
    }

    private initializeSocketsListeners() {
        this.socketSubscriptions.push(this.sockets.get('Messages').onInsert().subscribe(res => this.onChangeMessage(res.new as Message)));
        this.socketSubscriptions.push(this.sockets.get('Messages').onUpdate().subscribe(res => this.onChangeMessage(res.new as Message)));
        this.socketSubscriptions.push(this.sockets.get('Messages').onDelete().subscribe(res => this.onDeleteMessage(res.old as Message)));
    }

    private onChangeMessage(message: Message) {
        if (!((message.from === this.auth.getUserUUID() && message.to === this.recipientID) || (message.to === this.auth.getUserUUID() && message.from === this.recipientID))) return;
        this.messages[message.id!] = message;
        this.markAsRead(Object.values(this.messages));
    }

    private onDeleteMessage(message: Message) {
        if (!((message.from === this.auth.getUserUUID() && message.to === this.recipientID) || (message.to === this.auth.getUserUUID() && message.from === this.recipientID))) return;
        delete this.messages[message.id!];
    }

    protected readonly Object = Object;

    private markAsRead(messages: Message[]) {
        const ids = messages.filter(m => !m.isRead && m.to === this.auth.getUserUUID()).map(m => m.id!);
        (this.serviceFactory.get('messages') as MessageService).markAsRead(ids).subscribe();
    }

    ngAfterViewInit() {
        this.itemsElements.changes.subscribe(() => this.scrollToBottom());
    }

    private scrollToBottom() {
        this.withScroll.nativeElement.scrollTop = this.withScroll.nativeElement.scrollHeight;
    }
}
