import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {EventService} from "../../architecture/services/EventService";
import { LanguageService } from "../language.service";

export class LeaveEventCommand implements Command {
    private notify: Notify;
    private languageService: LanguageService;
    

    constructor(
        private serviceFactory: ServiceFactory,
        private event: CommunityEvent,
        private userID: string
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.languageService = this.serviceFactory.get('languageService') as LanguageService;
    }

    execute(): void {
        let inform = (this.languageService.current == 'en') ? `Are you sure you want to leave ${this.event?.title} event?`
                        : `¿Estás seguro de que quieres salir del evento ${this.event?.title}?`;
                        
        this.notify.confirm(inform).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('events') as EventService).leaveEvent(this.event?.id!, this.userID).subscribe({
                next: () => {
                    let text = (this.languageService.current == 'en') ? `You have left ${this.event?.title}` : `Dejaste la comunidad ${this.event?.title}`;
                    this.notify.success(text);
                },
                error: res => {
                    let text = (this.languageService.current == 'en') ? `We have problems adding you to this event: ${res.message}` : `Tuvimos un problema al intentar añadirte a este evento: ${res.message}`;
                    this.notify.error(text)
                } 
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