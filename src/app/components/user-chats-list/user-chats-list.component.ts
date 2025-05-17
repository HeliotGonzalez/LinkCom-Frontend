import {Component, Input} from '@angular/core';
import {UserCardComponent} from "../user-card/user-card.component";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {Router} from "@angular/router";
import {UserChat} from "../../../architecture/model/UserChat";
import {MessageService} from "../../../architecture/services/MessageService";
import {AuthService} from "../../services/auth.service";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-chats-list',
    imports: [
        UserCardComponent,
        FormsModule
    ],
  templateUrl: './user-chats-list.component.html',
  styleUrl: './user-chats-list.component.css'
})
export class UserChatsListComponent {
    protected readonly Object = Object;
    protected userChats: {[key: string]: UserChat} = {};
    protected filteredUserChats: {[key: string]: UserChat} = {};
    protected search = "";

    @Input() activeRecipientID!: string;

    constructor(
        private serviceFactory: ServiceFactory,
        private sockets: WebSocketFactory,
        protected router: Router,
        private auth: AuthService
    ) {
    }

    ngOnInit() {
        (this.serviceFactory.get('messages') as MessageService).getChats(this.auth.getUserUUID()).subscribe(res => {
            res.data.forEach(c => this.userChats[c.id!] = c);
            this.applyFilter();
        });
        this.initializeSockets();
    }

    private initializeSockets() {
        this.sockets.get('UserChat').onInsert().subscribe(res => this.onChangeChat(res.new as UserChat));
        this.sockets.get('UserChat').onUpdate().subscribe(res => this.onChangeChat(res.new as UserChat));
        this.sockets.get('UserChat').onDelete().subscribe(res => this.onDeleteChat(res.old as UserChat));
    }

    private onChangeChat(chat: UserChat) {
        if (chat.from !== this.auth.getUserUUID()) return;
        if (chat.hidden) this.onDeleteChat(chat);
        else this.userChats[chat.id!] = chat;
        this.sortChats();
    }

    private onDeleteChat(chat: UserChat) {
        if (chat.from !== this.auth.getUserUUID() && chat.hidden) return;
        delete this.userChats[chat.id!];
    }

    private sortChats() {
        this.userChats = Object.fromEntries(
            Object.entries(this.userChats)
                .sort(([, a], [, b]) => new Date(b.last_used_at).getTime() - new Date(a.last_used_at).getTime())
        );
        this.applyFilter();
    }

    protected applyFilter() {
        this.filteredUserChats = Object.fromEntries(
            Object.entries(this.userChats).filter(([id, c]) => c.toUsername.toLowerCase().includes(this.search.toLowerCase()))
        );

    }
}
