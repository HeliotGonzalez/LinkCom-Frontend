import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {EventService} from "../../architecture/services/EventService";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Command} from "../../architecture/control/Command";
import {LanguageService} from "../language.service";
import {CommunityService} from "../../architecture/services/CommunityService";
import {NotificationService} from "../../architecture/services/NotificationService";
import {NotificationType} from "../../architecture/model/NotificationType";

export class CreateEventCommand implements Command {
    private notify: Notify;
    private router: Router;
    private auth: AuthService;
    private languageService: LanguageService;

    constructor(
        private serviceFactory: ServiceFactory,
        private event: CommunityEvent,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.router = this.serviceFactory.get('router') as Router;
        this.auth = this.serviceFactory.get('auth') as AuthService;
        this.languageService = this.serviceFactory.get('languageService') as LanguageService;
    }

    execute(): void {
        (this.serviceFactory.get('events') as EventService).createEvent(this.event as CommunityEvent).subscribe({
            next: res => {
                const event = res.data[0];
                let text = (this.languageService.current == 'en') ? 'Your event has been created!' : '¡Tu evento acaba de ser creado!';
                (this.serviceFactory.get('events') as EventService).joinEvent(event.communityID, event.id!, this.auth.getUserUUID()).subscribe();
                this.notify.success(text);
                this.router.navigate(["/community", this.event.communityID]).then();
                (this.serviceFactory.get('communities') as CommunityService).getCommunityModerators(this.event.communityID).subscribe(res => {
                    if (res.data.find(m => m.id === this.auth.getUserUUID())) return;
                    res.data.forEach(
                        m => (this.serviceFactory.get('notifications') as NotificationService).send({
                            recipientID: m.id!,
                            relatedID: event.id!,
                            type: NotificationType.EVENT_REQUEST
                        }).subscribe()
                    )
                })
            },
            error: res =>{
                let text = (this.languageService.current == 'en') ? `We could not create your event: ${res.message}` : `Ha ocurrido un error al crear tu evento: ${res.message}`;
                this.notify.error(text) 
            } 
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