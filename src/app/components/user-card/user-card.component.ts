import {Component, Input} from '@angular/core';
import {User} from "../../../architecture/model/User";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {UserService} from "../../../architecture/services/UserService";

@Component({
    selector: 'app-user-card',
    imports: [],
    templateUrl: './user-card.component.html',
    standalone: true,
    styleUrl: './user-card.component.css'
})
export class UserCardComponent {
    @Input() userID!: string;

    protected user!: User;

    constructor(
        private serviceFactory: ServiceFactory
    ) {
    }

    ngOnInit() {
        (this.serviceFactory.get('users') as UserService).getUser(this.userID).subscribe(res => this.user = res.data[0]);
    }
}
