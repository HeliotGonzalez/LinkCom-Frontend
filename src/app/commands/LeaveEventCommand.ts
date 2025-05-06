import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {EventService} from "../../architecture/services/EventService";

export class LeaveEventCommand implements Command {
    private notify: Notify;

    constructor(
        private serviceFactory: ServiceFactory,
        private event: CommunityEvent,
        private userID: string
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
    }

    execute(): void {
        this.notify.confirm(`Are you sure you want to leave ${this.event?.title} event?`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('events') as EventService).leaveEvent(this.event?.id!, this.userID).subscribe({
                next: () => {
                    this.notify.success(`You have left ${this.event?.title}`);
                },
                error: res => this.notify.error(`We have problems adding you to this event: ${res.message}`)
            });
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private event: CommunityEvent | null = null;
        private userID: string | null = null;

        static create() {
            return new LeaveEventCommand.Builder();
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
            return new LeaveEventCommand(this.serviceFactory!, this.event!, this.userID!);
        }
    }
}