import {Command} from "../../architecture/Commands/Command";
import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {EventService} from "../../architecture/services/EventService";

export class JoinEventCommand implements Command {
    private notify: Notify;

    constructor(
        private serviceFactory: ServiceFactory,
        private event: CommunityEvent,
        private userID: string
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
    }

    execute(): void {
        (this.serviceFactory.get('events') as EventService).joinEvent(this.event?.communityID!, this.event?.id!, this.userID).subscribe({
            next: () => {
                this.notify.success(`You have joined ${this.event?.title}`);
            },
            error: res => this.notify.error(`We have problems adding you to this event: ${res.message}`)
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private event: CommunityEvent | null = null;
        private userID: string | null = null;

        static create() {
            return new JoinEventCommand.Builder();
        }

        withFactory(serviceFactory: ServiceFactory) {
            this.serviceFactory = serviceFactory;
            return this;
        }

        withEvent(event: CommunityEvent) {
            this.event = event;
            return this;
        }

        withUser(userID: string) {
            this.userID = userID;
            return this;
        }

        build() {
            return new JoinEventCommand(this.serviceFactory!, this.event!, this.userID!);
        }
    }
}