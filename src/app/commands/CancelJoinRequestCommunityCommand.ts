import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {NotificationService} from "../../architecture/services/NotificationService";

export class CancelJoinRequestCommunityCommand implements Command {
    private notify: Notify;

    constructor(
        private serviceFactory: ServiceFactory,
        private community: Community,
        private userID: string
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
    }

    execute(): void {
        this.notify.confirm(`Your join request will disappear!`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).cancelRequest(this.community.id!, this.userID).subscribe({
                next: res => {
                    this.notify.success('You have canceled this join request!');
                    (this.serviceFactory.get('notifications') as NotificationService).removeFromRelated([res.data[0].id!]).subscribe();
                },
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
            else this.notify.error('Your request is still being processed', 'Process interrupted!');
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;
        private userID: string | null = null;

        static create() {
            return new CancelJoinRequestCommunityCommand.Builder();
        }

        withFactory(serviceFactory: ServiceFactory) {
            this.serviceFactory = serviceFactory;
            return this;
        }

        withCommunity(community: Community) {
            this.community = community;
            return this;
        }

        withUser(userID: string) {
            this.userID = userID;
            return this;
        }

        build() {
            return new CancelJoinRequestCommunityCommand(this.serviceFactory!, this.community!, this.userID!);
        }
    }
}