import {Component} from '@angular/core';
import {InputComponent} from "../../components/input/input.component";
import {UserCardComponent} from "../../components/user-card/user-card.component";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {UserService} from "../../../architecture/services/UserService";
import {User} from "../../../architecture/model/User";

@Component({
    selector: 'app-messages',
    imports: [
        InputComponent,
        UserCardComponent
    ],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css'
})
export class MessagesComponent {
    protected users: User[] = [];

    constructor(
        private serviceFactory: ServiceFactory
    ) {
    }

    ngOnInit() {
        (this.serviceFactory.get('users') as UserService).getAllUsers().subscribe(res => this.users = [...res.data]);
    }
}
