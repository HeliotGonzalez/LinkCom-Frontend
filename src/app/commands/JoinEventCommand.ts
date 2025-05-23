import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {CommunityEvent} from "../../architecture/model/CommunityEvent";
import {EventService} from "../../architecture/services/EventService";
import { LanguageService } from "../language.service";
import { RequestStatus } from "../../architecture/model/RequestStatus";

export class JoinEventCommand implements Command {
    private notify: Notify;
    private languageService: LanguageService;

    constructor(
        private serviceFactory: ServiceFactory,
        private event: CommunityEvent,
        private userID: string,
        private joinStatus: RequestStatus
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.languageService = this.serviceFactory.get('languageService') as LanguageService;
        
    }

    execute(): void {
        (this.serviceFactory.get('events') as EventService).joinEvent(this.event?.communityID!, this.event?.id!, this.userID, this.joinStatus).subscribe({
            next: () => {
                let text = (this.languageService.current == 'en') ? `You have joined to ${this.event?.title}` : `Te acabas de unir al evento ${this.event?.title}`;
                this.notify.success(text);
            },
            error: res => {
                let text = (this.languageService.current == 'en') ? `We have problems adding you to this event: ${res.message}` : `Ha ocurrido un error al intentar añadirte al evento: ${res.message}`
                this.notify.error(text)
            }
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private event: CommunityEvent | null = null;
        private userID: string | null = null;
        private joinStatus: RequestStatus = RequestStatus.PENDING;

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

        withJoinStatus(joinStatus?: RequestStatus) {
            if (joinStatus)
                this.joinStatus = joinStatus;
            return this;
        }

        build() {
            return new JoinEventCommand(this.serviceFactory!, this.event!, this.userID!, this.joinStatus);
        }
    }
}