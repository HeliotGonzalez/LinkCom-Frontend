import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {EventService} from "../../architecture/services/EventService";
import { Command } from "../../architecture/control/Command";
import { LanguageService } from "../language.service";

export class AcceptEventCommand implements Command {
    private notify: Notify;
    private languageService: LanguageService;

    constructor(
        private serviceFactory: ServiceFactory,
        private eventID: string,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.languageService = this.serviceFactory.get('languageService') as LanguageService;
    }

    execute(): void {
        (this.serviceFactory.get('events') as EventService).acceptEvent(this.eventID).subscribe({
            next: () => {
                if (this.languageService.current == 'en') this.notify.success('The event will be now displayed in the community events feed!');
                else this.notify.success('El evento será visible en la feed de la comunidad');
            },
            error: () => {
                if (this.languageService.current == 'en') this.notify.error('Something went wrong :C')
                else this.notify.error('Algo falló, inténtalo más tarde');
            }
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