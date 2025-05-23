import {Command} from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {NotificationService} from "../../architecture/services/NotificationService";
import {NotificationType} from "../../architecture/model/NotificationType";
import { LanguageService } from "../language.service";

export class JoinCommunityCommand implements Command {
    private notify: Notify;
    private languageService: LanguageService;
    

    constructor(
        private serviceFactory: ServiceFactory,
        private community: Community,
        private userID: string
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.languageService = this.serviceFactory.get('languageService') as LanguageService;
    }

    execute(): void {
        if (this.community.isPrivate) {
            (this.serviceFactory.get('communities') as CommunityService).requestJoinToCommunity(this.community.id!, this.userID).subscribe({
                next: requestResponse => {
                    let title = (this.languageService.current == 'en') ? 'Request sent!' : '¡Petición enviada!';
                    let text = (this.languageService.current == 'en') ? 'The request has been sent! Now you have to wait for a response' : '¡La solicitud ha sido enviada! Debes esperar a la respuesta de un moderador';
                    this.notify.info(title, text);
                    (this.serviceFactory.get('communities') as CommunityService).getCommunityModerators(this.community.id!).subscribe(res => {
                        res.data.forEach(u => (this.serviceFactory.get('notifications') as NotificationService).send({recipientID: u.id!, relatedID: requestResponse.data[0].id!, type: NotificationType.JOIN_REQUEST}).subscribe());
                    })
                },
                error: res => {
                    let text = (this.languageService.current == 'en') ? `An error occurred: ${res.message}` : `Ha ocurrido un error: ${res.message}`
                    this.notify.error(text)
                }
            });
        } else {
            (this.serviceFactory.get('communities') as CommunityService).joinCommunity(this.community.id!, this.userID).subscribe({
                next: () => {
                    let text = (this.languageService.current == 'en') ? 'You have join this community!' : '¡Te acabas de unir a esta comunidad!';
                    this.notify.success(text);
                },
                error: res => {
                    let text = (this.languageService.current == 'en') ? `An error occurred: ${res.message}` : `Ha ocurrido un error: ${res.message}`
                    this.notify.error(text)
                }
            });
        }
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;
        private userID: string | null = null;

        static create() {
            return new JoinCommunityCommand.Builder();
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
            return new JoinCommunityCommand(this.serviceFactory!, this.community!, this.userID!);
        }
    }
}