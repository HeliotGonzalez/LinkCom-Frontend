import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Community} from "../../../../architecture/model/Community";
import {AuthService} from "../../../services/auth.service";

@Component({
    selector: 'app-community-card',
    standalone: true,
    imports: [],
    templateUrl: './community-card.component.html',
    styleUrl: './community-card.component.css'
})
export class CommunityCardComponent {
    @Input() community!: Community;
    @Input() isUserJoined: boolean = false;
    @Input() isRequested: boolean = false;
    @Output() joinCommunityEmitter = new EventEmitter<Community>();
    @Output() leaveCommunityEmitter = new EventEmitter<Community>();
    @Output() removeCommunityEmitter = new EventEmitter<Community>();
    @Output() cancelRequestEmitter = new EventEmitter<Community>();

    constructor(
        private router: Router,
        private auth: AuthService
    ) {
    }

    viewCommunity() {
        this.router.navigate(['community'], {
            queryParams: {
                communityID: this.community.id,
                isUserJoined: this.isUserJoined
            }
        }).then();
    }

    joinCommunity() {
        this.joinCommunityEmitter.emit(this.community);
    }

    leaveCommunity() {
        this.leaveCommunityEmitter.emit(this.community);
    }

    removeCommunity() {
        this.removeCommunityEmitter.emit(this.community);
    }

    isCreator() {
        return this.community.creatorID === this.auth.getUserUUID();
    }

    cancelRequest() {
        this.cancelRequestEmitter.emit(this.community);
    }
}
