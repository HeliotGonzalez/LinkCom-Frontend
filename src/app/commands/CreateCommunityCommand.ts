import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import { Command } from "../../architecture/control/Command";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";

export class CreateCommunityCommand implements Command {
    private notify: Notify;
    private router: Router;
    private auth: AuthService;

    constructor(
        private serviceFactory: ServiceFactory,
        private community: Community,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.router = this.serviceFactory.get('router') as Router;
        this.auth = this.serviceFactory.get('auth') as AuthService;
    }

    execute(): void {
        (this.serviceFactory.get('communities') as CommunityService).createCommunity(this.community).subscribe({
            next: res => {
                const event = res.data[0];
                (this.serviceFactory.get('communities') as CommunityService).joinCommunity(this.community!.id!, this.auth.getUserUUID()).subscribe();
                this.notify.success('Your event has been created!');
                this.router.navigate(["/communities"]).then();
            },
            error: res => this.notify.error(`We could not create your event: ${res.error.message}`)
        })
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;

        static create() {
            return new CreateCommunityCommand.Builder();
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
            return new CreateCommunityCommand(this.serviceFactory!, this.community!);
        }
    }
}