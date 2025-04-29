import {Command} from "../../architecture/Commands/Command";
import {Notify} from "../services/notify";
import {inject} from "@angular/core";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";

export class LeaveCommunityCommand implements Command {
    private notify: Notify;

    constructor(
        private serviceFactory: ServiceFactory,
        private community: Community,
        private userID: string,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
    }

    execute(): void {
        this.notify.confirm(`You will be leaving ${this.community?.name}'s community`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).leaveCommunity(this.community!.id!, this.userID).subscribe({
                next: () => this.notify.success('You have left this community!'),
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;
        private userID: string | null = null;

        static create() {
            return new LeaveCommunityCommand.Builder();
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
            return new LeaveCommunityCommand(this.serviceFactory!, this.community!, this.userID!);
        }
    }
}