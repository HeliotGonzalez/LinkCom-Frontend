import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {NotificationService} from "../../architecture/services/NotificationService";
import { LanguageService } from "../language.service";

export class CancelJoinRequestCommunityCommand implements Command {
    private notify: Notify;
    private languageService: LanguageService;

    constructor(
        private serviceFactory: ServiceFactory,
        private community: Community,
        private userID: string,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.languageService = this.serviceFactory.get('languageService') as LanguageService;
    }

    execute(): void {
        let text = (this.languageService.current == 'en') ? 'Your join request will disappear!' : 'Tu petición va a desaparecer';
        this.notify.confirm(text).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).cancelRequest(this.community.id!, this.userID).subscribe({
                next: res => {
                    let textSuccess = (this.languageService.current == 'en') ? 'You have canceled this join request!' : 'Tu petición ha sido cancelada';
                    this.notify.success(textSuccess);
                    (this.serviceFactory.get('notifications') as NotificationService).removeFromRelated([res.data[0].id!]).subscribe();
                },
                error: res => {
                    let textError = (this.languageService.current == 'en') ? `An error occurred: ${res.message}` : `Ha ocurrido un error ${res.message}`
                    this.notify.error(textError)
                }
            });
            else {
                let textError = (this.languageService.current == 'en') ? 'Your request is still being processed' : 'Tu petición está siendo procesada';
                let textErr = (this.languageService.current == 'en') ? 'Process interrupted!' : 'Proceso interrumpido';
                this.notify.error(textError, textErr);
            }
        });
    }
    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;
        private userID: string | null = null;

        static create() {
            return new CancelJoinRequestCommunityCommand.Builder();
        }

        withFactory(serviceFactory: ServiceFactory) {
            this.serviceFactory = serviceFactory;
            return this;
        }

        withCommunity(community: Community) {
            this.community = community;
            return this;
        }

        withUser(userID: string) {
            this.userID = userID;
            return this;
        }

        build() {
            return new CancelJoinRequestCommunityCommand(this.serviceFactory!, this.community!, this.userID!);
        }
    }
} 