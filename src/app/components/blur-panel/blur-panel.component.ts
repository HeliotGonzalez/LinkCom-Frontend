import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityRequestComponent} from "../community-request/community-request.component";
import {Community} from "../../../architecture/model/Community";
import {User} from "../../../architecture/model/User";
import {JoinRequest} from "../../../architecture/model/JoinRequest";
import {ActivatedRoute} from "@angular/router";
import {ServiceFactory} from "../../services/api-services/ServiceFactory.service";
import {WebSocketFactory} from "../../services/api-services/WebSocketFactory.service";
import {AuthService} from "../../services/auth.service";
import {CommunityService} from "../../../architecture/services/CommunityService";
import {RequestStatus} from "../../../architecture/model/RequestStatus";
import {UserService} from "../../../architecture/services/UserService";

@Component({
    selector: 'app-blur-panel',
    imports: [

    ],
    templateUrl: './blur-panel.component.html',
    styleUrl: './blur-panel.component.css'
})
export class BlurPanelComponent {
    @Input() isVisible!: boolean;

    constructor(
    ) {
    }
}
