import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {EventService} from "../../architecture/services/EventService";

export class RemoveEventCommand implements Command {
    private notify: Notify;

    constructor(
        private serviceFactory: ServiceFactory,
        private event: CommunityEvent,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
    }

    execute(): void {
        this.notify.confirm(`You will not be able to revert this: REMOVE ${this.event?.title}'s community`).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('events') as EventService).removeEvent(this.event!.id!).subscribe({
                next: () => this.notify.success('You have removed this event!'),
                error: res => this.notify.error(`An error occurred: ${res.message}`)
            });
            else this.notify.success('Your event is still safe!');
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private event: CommunityEvent | null = null;

        static create() {
            return new RemoveEventCommand.Builder();
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
            return new RemoveEventCommand(this.serviceFactory!, this.event!);
        }
    }
}