import {Component, Input} from '@angular/core';
import {User} from "../../../architecture/model/User";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {UserService} from "../../../architecture/services/UserService";
import {MessageService} from "../../../architecture/services/MessageService";
import {AuthService} from "../../services/auth.service";
import {NgClass} from "@angular/common";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";
import {Message} from "../../../architecture/model/Message";

@Component({
    selector: 'app-user-card',
    imports: [
        NgClass
    ],
    templateUrl: './user-card.component.html',
    standalone: true,
    styleUrl: './user-card.component.css'
})
export class UserCardComponent {
    @Input() userID!: string;
    @Input() chatID!: string;
    @Input() active!: boolean;

    protected user!: User;
    protected unreadMessages: {[key: string]: Message} = {};

    constructor(
        private serviceFactory: ServiceFactory,
        private auth: AuthService,
        private sockets: WebSocketFactory
    ) {
    }

    ngOnInit() {
        (this.serviceFactory.get('users') as UserService).getUser(this.userID).subscribe(res => {
            this.user = res.data[0];
            (this.serviceFactory.get('messages') as MessageService).getBetweenAndFrom(this.userID, this.auth.getUserUUID()).subscribe(res => res.data.filter(m => !m.read_at).forEach(m => this.unreadMessages[m.id!] = m));
        });
        this.initializeSockets();
    }

    hideChat() {
        (this.serviceFactory.get('messages') as MessageService).hideChatBetween(this.auth.getUserUUID(), this.userID).subscribe();
    }

    private initializeSockets() {
        this.sockets.get('Messages').onInsert().subscribe(res => this.onChangeMessage(res.new as Message));
        this.sockets.get('Messages').onUpdate().subscribe(res => this.onChangeMessage(res.new as Message));
    }

    private onChangeMessage(message: Message) {
        if (!(message.to === this.auth.getUserUUID() && message.from === this.userID)) return;
        if (message.read_at) delete this.unreadMessages[message.id!];
        else this.unreadMessages[message.id!] = message;
    }

    protected readonly Object = Object;
}
