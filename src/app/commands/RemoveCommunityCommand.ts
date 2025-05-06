import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";

export class RemoveCommunityCommand implements Command {
    private notify: Notify;

    constructor(
        private serviceFactory: ServiceFactory,
        private community: Community,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
    }

    execute(): void {
        this.notify.confirm(`You will not be able to revert this: REMOVE ${this.community?.name}'s community`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).removeCommunity(this.community!.id!).subscribe({
                next: () => this.notify.success('You have removed this community!'),
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
            else this.notify.success('Your community is still safe!');
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;

        static create() {
            return new RemoveCommunityCommand.Builder();
        }

        withFactory(serviceFactory: ServiceFactory) {
            this.serviceFactory = serviceFactory;
            return this;
        }

        withCommunity(community: Community) {
            this.community = community;
            return this;
        }

        build() {
            return new RemoveCommunityCommand(this.serviceFactory!, this.community!);
        }
    }
}