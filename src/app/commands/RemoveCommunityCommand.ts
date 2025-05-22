import { Command } from "../../architecture/control/Command";
import {Notify} from "../services/notify";
import {CommunityService} from "../../architecture/services/CommunityService";
import {Community} from "../../architecture/model/Community";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import { LanguageService } from "../language.service";

export class RemoveCommunityCommand implements Command {
    private notify: Notify;
    private languageService: LanguageService;
    

    constructor(
        private serviceFactory: ServiceFactory,
        private community: Community,
    ) {
        this.notify = this.serviceFactory.get('notify') as Notify;
        this.languageService = this.serviceFactory.get('languageService') as LanguageService;
    }

    execute(): void {
        let inform = (this.languageService.current == 'en') ? `You will not be able to revert this: REMOVE ${this.community?.name}'s community` 
                        : `No podrás revertir esta acción: Eliminando ${this.community?.name}`;
                        
        this.notify.confirm(inform).then(confirmed => {
            if (confirmed) (this.serviceFactory.get('communities') as CommunityService).removeCommunity(this.community!.id!).subscribe({
                next: () => {
                    let text = (this.languageService.current == 'en') ? 'You have removed this community!' : '¡Has eliminado esta comunidad!';
                    this.notify.success(text)
                },
                error: res => {
                    let text = (this.languageService.current == 'en') ? `An error occurred: ${res.message}` : `Ha habido un error: ${res.message}`;
                    this.notify.error(text)
                } 
            });
            else {
                let text = (this.languageService.current == 'en') ? 'Your community is still safe!' : '¡Tu comunidad está segura!';
                this.notify.success(text);
            } 
        });
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private community: Community | null = null;

        static create() {
            return new RemoveCommunityCommand.Builder();
        }

        withFactory(serviceFactory: ServiceFactory) {
            this.serviceFactory = serviceFactory;
            return this;
        }

        withCommunity(community: Community) {
            this.community = community;
            return this;
        }

        build() {
            return new RemoveCommunityCommand(this.serviceFactory!, this.community!);
        }
    }
}