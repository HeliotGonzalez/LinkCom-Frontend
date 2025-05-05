import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {EventService} from "../../architecture/services/EventService";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import { Command } from "../../architecture/control/Command";

export class CreateEventCommand implements Command {
    private notify: Notify;
    private router: Router;
    private auth: AuthService;

    constructor(
        private serviceFactory: ServiceFactory,
        private event: CommunityEvent,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.router = this.serviceFactory.get('router') as Router;
        this.auth = this.serviceFactory.get('auth') as AuthService;
    }

    execute(): void {
        (this.serviceFactory.get('events') as EventService).createEvent(this.event as CommunityEvent).subscribe({
            next: res => {
                const event = res.data[0];
                (this.serviceFactory.get('events') as EventService).joinEvent(event.communityID, event.id!, this.auth.getUserUUID()).subscribe();
                this.notify.success('Your event has been created!');
                this.router.navigate(["/community"], {queryParams: {communityID: this.event.communityID!}}).then();
            },
            error: res => this.notify.error(`We could not create your event: ${res.message}`)
        })
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private event: CommunityEvent | null = null;

        static create() {
            return new CreateEventCommand.Builder();
        }

        withFactory(serviceFactory: ServiceFactory) {
            this.serviceFactory = serviceFactory;
            return this;
        }

        withEvent(event: CommunityEvent) {
            this.event = event;
            return this;
        }

        build() {
            return new CreateEventCommand(this.serviceFactory!, this.event!);
        }
    }
}