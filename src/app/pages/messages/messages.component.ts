import {Component} from '@angular/core';
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
import {RouterCommand} from "../../commands/RouterCommand";

@Component({
    selector: 'app-messages',
    imports: [
        InputComponent,
        UserCardComponent,
        MessageComponent
    ],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css'
})
export class MessagesComponent {
    protected users: User[] = [];
    protected messages: {[key: string]: Message} = {};
    protected recipientID: string | null = null;
    protected recipient: User | null = null;

    protected recipientSubscription: Subscription | null = null;
    protected friendsSubscription: Subscription | null = null;
    protected messagesSubscription: Subscription | null = null;

    constructor(
        private route: ActivatedRoute,
        protected router: Router,
        protected serviceFactory: ServiceFactory,
        private sockets: WebSocketFactory,
        protected auth: AuthService
    ) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.recipientID = params.get('id');
            this.messages = {};
            if (this.recipientID)
                this.recipientSubscription = (this.serviceFactory.get('users') as UserService).getUser(this.recipientID).subscribe(res => this.recipient = res.data[0]);
            this.friendsSubscription = (this.serviceFactory.get('users') as UserService).getAllUsers().subscribe(res => {
                this.users = [...res.data];
                this.messagesSubscription = (this.serviceFactory.get('messages') as MessageService).getBetween(this.auth.getUserUUID(), this.recipientID!).subscribe(res => res.data.forEach(m => this.messages[m.id!] = m));
            });
        });
        this.initializeSocketsListeners();
    }

    ngOnDestroy() {
        this.recipientSubscription?.unsubscribe();
        this.friendsSubscription?.unsubscribe();
        this.messagesSubscription?.unsubscribe();
    }

    send(body: string) {
        const message: Message = {
            from: this.auth.getUserUUID(),
            to: this.recipientID!,
            body: btoa(body),
            isRead: false,
            created_at: new Date().toISOString()
        };
        (this.serviceFactory.get('messages') as MessageService).send(message).subscribe();
    }

    removeMessage(id: string) {
        (this.serviceFactory.get('messages') as MessageService).delete(id).subscribe();
    }

    private initializeSocketsListeners() {
        this.sockets.get('Messages').onInsert().subscribe(res => this.onChangeMessage(res.new as Message));
        this.sockets.get('Messages').onUpdate().subscribe(res => this.onChangeMessage(res.new as Message));
        this.sockets.get('Messages').onDelete().subscribe(res => this.onDeleteMessage(res.old as Message));
    }

    private onChangeMessage(message: Message) {
        if (message.from !== this.auth.getUserUUID() && message.to === this.recipientID || message.to !== this.auth.getUserUUID() && message.from === this.recipientID) return;
        this.messages[message.id!] = message;
    }

    private onDeleteMessage(message: Message) {
        if (message.from !== this.auth.getUserUUID() && message.to === this.recipientID || message.to !== this.auth.getUserUUID() && message.from === this.recipientID) return;
        delete this.messages[message.id!];
    }

    protected readonly Object = Object;
}
