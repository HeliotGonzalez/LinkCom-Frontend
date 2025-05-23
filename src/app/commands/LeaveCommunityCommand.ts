import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import { LanguageService } from "../language.service";

export class LeaveCommunityCommand implements Command {
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
        let inform = (this.languageService.current == 'en') ? `You will be leaving ${this.community?.name}'s community`
                        : `Vas a abandonar la comunidad ${this.community?.name}`;

        this.notify.confirm(inform).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).leaveCommunity(this.community!.id!, this.userID).subscribe({
                next: () =>{
                    let text = (this.languageService.current == 'en') ? 'You have left this community!' : '¡Has abandonado esta comunidad!';
                    this.notify.success(text)
                } ,
                error: res =>{
                    let text = (this.languageService.current == 'en') ? `An error occurred: ${res.message}` : `Ha ocurrido un error: ${res.message}`;
                    this.notify.error(text)
                } 
            });
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;
        private userID: string | null = null;

        static create() {
            return new LeaveCommunityCommand.Builder();
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
            return new LeaveCommunityCommand(this.serviceFactory!, this.community!, this.userID!);
        }
    }
}