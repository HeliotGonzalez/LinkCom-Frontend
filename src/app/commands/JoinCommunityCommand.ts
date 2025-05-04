import {Command} from "../../architecture/Commands/Command";
import {Notify} from "../services/notify";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";

export class JoinCommunityCommand implements Command {
    private notify: Notify;

    constructor(
        private serviceFactory: ServiceFactory,
        private community: Community,
        private userID: string
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
    }

    execute(): void {
        if (this.community.isPrivate) {
            (this.serviceFactory.get('communities') as CommunityService).requestJoinToCommunity(this.community.id!, this.userID).subscribe({
                next: () => this.notify.info('Request sent!', 'The request has been sent! Now you have to wait for a response'),
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        } else {
            (this.serviceFactory.get('communities') as CommunityService).joinCommunity(this.community.id!, this.userID).subscribe({
                next: () => {
                    this.notify.success('You have join this community!');
                },
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
        }
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;
        private userID: string | null = null;

        static create() {
            return new JoinCommunityCommand.Builder();
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
            return new JoinCommunityCommand(this.serviceFactory!, this.community!, this.userID!);
        }
    }
}