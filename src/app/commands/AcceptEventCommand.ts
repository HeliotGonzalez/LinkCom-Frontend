import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {EventService} from "../../architecture/services/EventService";
import { Command } from "../../architecture/control/Command";

export class AcceptEventCommand implements Command {
    private notify: Notify;

    constructor(
        private serviceFactory: ServiceFactory,
        private eventID: string
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
    }

    execute(): void {
        (this.serviceFactory.get('events') as EventService).acceptEvent(this.eventID).subscribe({
            next: () => this.notify.success('The event will be now displayed in the community events feed!'),
            error: () => this.notify.error('Something went wrong :C')
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private eventID: string = "";

        static create() {
            return new AcceptEventCommand.Builder();
        }

        withFactory(serviceFactory: ServiceFactory) {
            this.serviceFactory = serviceFactory;
            return this;
        }

        withEventID(eventID: string) {
            this.eventID = eventID;
            return this;
        }

        build() {
            return new AcceptEventCommand(this.serviceFactory!, this.eventID!);
        }
    }
}