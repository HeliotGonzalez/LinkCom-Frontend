import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {InputComponent} from "../../components/input/input.component";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {UserService} from "../../../architecture/services/UserService";
import {User} from "../../../architecture/model/User";
import {MessageService} from "../../../architecture/services/MessageService";
import {AuthService} from "../../services/auth.service";
import {Message} from "../../../architecture/model/Message";
import {MessageComponent} from "../../components/message/message.component";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";
import {firstValueFrom, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Notify} from "../../services/notify";
import {UsersListComponent} from "../users-list/users-list.component";
import {NotificationService} from "../../../architecture/services/NotificationService";
import {SendMessageCommand} from "../../commands/SendMessageCommand";
import {TextSerializer} from "../../../architecture/io/TextSerializer";
import {UserChat} from "../../../architecture/model/UserChat";
import {UserChatsListComponent} from "../../components/user-chats-list/user-chats-list.component";
import { LanguageService } from '../../language.service';
import {NgClass} from "@angular/common";
import {marked} from "marked";

@Component({
    selector: 'app-messages',
    imports: [
        InputComponent,
        MessageComponent,
        UsersListComponent,
        UserChatsListComponent,
        NgClass
    ],
    templateUrl: './messages.component.html',
    standalone: true,
    styleUrl: './messages.component.css'
})
export class MessagesComponent {
    @ViewChild('withScroll') private withScroll!: ElementRef;
    @ViewChildren('item') private itemsElements!: QueryList<ElementRef>;

    protected userChats: {[key: string]: UserChat} = {};
    protected messages: {[key: string]: Message} = {};
    protected recipientID: string | null = null;
    protected recipient: User | null = null;
    protected isRemoving: boolean = false;

    protected removeList: {[key: string]: Message} = {};

    protected subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        protected router: Router,
        protected serviceFactory: ServiceFactory,
        private sockets: WebSocketFactory,
        protected auth: AuthService,
        protected notify: Notify,
        private languageService: LanguageService
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.restart();
            this.recipientID = params.get('id');
            if (this.recipientID)
                this.subscriptions.push((this.serviceFactory.get('users') as UserService).getUser(this.recipientID).subscribe(res => {
                    this.recipient = res.data[0];
                    this.initializeSocketsListeners();
                }));
            this.subscriptions.push((this.serviceFactory.get('messages') as MessageService).getChats(this.auth.getUserUUID()).subscribe(async res => {
                res.data.forEach(c => this.userChats[c.id!] = c);
                const currentChat = Object.values(this.userChats).find(c => c.to === this.recipientID);
                if (this.recipientID && currentChat) this.subscriptions.push(
                    (this.serviceFactory.get('messages') as MessageService).createChat({
                        from: this.auth.getUserUUID(),
                        fromUsername: (await firstValueFrom((this.serviceFactory.get('users') as UserService).getUser(this.auth.getUserUUID()))).data[0].username,
                        hidden: false,
                        last_used_at: new Date().toISOString(),
                        to: this.recipientID,
                        toUsername: this.recipient!.username!
                    }).subscribe()
                );
                else if (this.recipientID && currentChat?.hidden) this.subscriptions.push(
                    (this.serviceFactory.get('messages') as MessageService).unhideChatBetween(this.auth.getUserUUID(), this.recipientID).subscribe()
                );
                this.subscriptions.push((this.serviceFactory.get('messages') as MessageService).getBetween(this.auth.getUserUUID(), this.recipientID!).subscribe(res => {
                    res.data.forEach(m => this.messages[m.id!] = m);
                    this.markAsRead(Object.values(this.messages));
                }));
            }));
        });
    }

    restart() {
        this.messages = {};
        this.recipient = null;
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    ngOnDestroy() {
        this.restart();
    }

    async send(body: string) {
        SendMessageCommand.Builder.create()
            .withFactory(this.serviceFactory)
            .withMessage({
                from: this.auth.getUserUUID(),
                to: this.recipientID!,
                body: TextSerializer.serialize(await marked(body)),
                created_at: new Date().toISOString()
            })
            .build().execute()
        this.scrollToBottom();
    }

    removeMessages() {
        let inform = (this.languageService.current == 'en') ? 'Do you want to remove this messsage?' : '¿Quieres eliminar este mensaje?'
        this.notify.confirm(inform).then(confirm => {
            if (confirm) (this.serviceFactory.get('messages') as MessageService).deleteFrom(Object.keys(this.removeList)).subscribe({
                next: () =>{
                    let text =  (this.languageService.current == 'en') ? 'This message has been removed' : 'Este mensaje ha sido eliminado'
                    this.notify.success(text)
                },
                error: err =>{
                    let text =  (this.languageService.current == 'en') ? `We could not remove this message: ${err.error}` : `No se pudo eliminar el mensaje: ${err.error}`
                    this.notify.error(text)
                }
            });
            else {
                let title = (this.languageService.current == 'en') ? 'Operation cancelled' : 'Operación cancelada'
                let text =  (this.languageService.current == 'en') ? 'This message is still safe' : 'El mensaje no fue eliminado'
                this.notify.error(text, title);
            } 
            this.removeList = {};
            this.isRemoving = false;
        });
    }

    removeMessage(isRemoving: boolean) {
        this.isRemoving = isRemoving;
    }

    private initializeSocketsListeners() {
        this.subscriptions.push(this.sockets.get('Messages').onInsert().subscribe(res => this.onChangeMessage(res.new as Message)));
        this.subscriptions.push(this.sockets.get('Messages').onUpdate().subscribe(res => this.onChangeMessage(res.new as Message)));
        this.subscriptions.push(this.sockets.get('Messages').onDelete().subscribe(res => this.onDeleteMessage(res.old as Message)));
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
        const ids = messages.filter(m => !m.read_at && m.to === this.auth.getUserUUID()).map(m => m.id!);
        (this.serviceFactory.get('messages') as MessageService).markAsRead(ids).subscribe();
        (this.serviceFactory.get('notifications') as NotificationService).removeFromRelated(ids).subscribe();
    }

    ngAfterViewInit() {
        this.itemsElements.changes.subscribe(() => this.scrollToBottom());
    }

    private scrollToBottom() {
        this.withScroll.nativeElement.scrollTop = this.withScroll.nativeElement.scrollHeight;
    }

    addToList(id: string) {
        this.removeList[id] = this.messages[id];
    }

    removeFromList(id: string) {
        delete this.removeList[id];
    }

    cancelRemoving() {
        this.isRemoving = false
        this.removeList = {};
    }
}
