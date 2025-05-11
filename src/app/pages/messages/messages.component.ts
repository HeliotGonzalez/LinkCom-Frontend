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
    protected messages: Message[] = [];
    protected recipient: string = "3c541401-7aeb-495e-80a2-487ff12ee29a";

    constructor(
        private serviceFactory: ServiceFactory,
        private sockets: WebSocketFactory,
        protected auth: AuthService
    ) {
    }

    ngOnInit() {
        (this.serviceFactory.get('users') as UserService).getAllUsers().subscribe(res => {
            this.users = [...res.data];
            (this.serviceFactory.get('messages') as MessageService).getBetween(this.auth.getUserUUID(), this.recipient).subscribe(res => this.messages = [...res.data]);
        });
        this.initializeSocketsListeners();
    }

    send(body: string) {
        const message: Message = {
            from: this.auth.getUserUUID(),
            to: this.recipient,
            body: body,
            isRead: false,
            created_at: new Date().toISOString()
        };
        (this.serviceFactory.get('messages') as MessageService).send(message).subscribe();
    }

    removeMessage(id: string) {
        (this.serviceFactory.get('messages') as MessageService).delete(id).subscribe();
    }

    private initializeSocketsListeners() {
        this.sockets.get('Messages').onInsert().subscribe(res => this.onInsertMessage(res.new as Message));
        this.sockets.get('Messages').onUpdate().subscribe(res => this.onUpdateMessage(res.new as Message));
        this.sockets.get('Messages').onDelete().subscribe(res => this.onDeleteMessage(res.old as Message));
    }

    private onInsertMessage(message: Message) {
        this.messages.push(message);
    }

    private onUpdateMessage(message: Message) {
    }

    private onDeleteMessage(message: Message) {
        this.messages = this.messages.filter(m => m.id !== message.id);
    }
}
