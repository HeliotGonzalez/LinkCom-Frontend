import {Component} from '@angular/core';
import {CommunityRequestComponent} from "../community-request/community-request.component";
import {ActivatedRoute, Router} from "@angular/router";
import {routes} from "../app.routes";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";

@Component({
    selector: 'app-community-requests-panel',
    imports: [
        CommunityRequestComponent
    ],
    templateUrl: './community-requests-panel.component.html',
    styleUrl: './community-requests-panel.component.css'
})
export class CommunityRequestsPanelComponent {
    protected community: Community | null = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private serviceFactory: ServiceFactory
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => (this.serviceFactory.get('communities') as CommunityService).getCommunity(params['communityID']).subscribe(res => this.community = res.data[0]));
    }

    closePanel() {
        this.route.queryParams.subscribe(params => this.router.navigate(["/community"], {queryParams: {communityID: params['communityID']}}).then(r => {
        }))
    }
}
