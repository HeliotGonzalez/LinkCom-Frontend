import { Command } from "../../architecture/control/Command";
import {Router} from "@angular/router";
import {ServiceFactory} from "../services/api-services/ServiceFactory.service";

export class RouterCommand implements Command {
    private router: Router;

    constructor(
        private serviceFactory: ServiceFactory,
        private route: string,
        private parameters: {[key: string]: string}
    ) {
        this.router = this.serviceFactory.get('router') as Router;
    }

    execute(): void {
        this.router.navigate([this.route], {queryParams: this.parameters}).then();
    }

    static Builder = class {
        private serviceFactory: ServiceFactory | null = null;
        private route = '/';
        private parameters: {[key: string]: string} = {};

        static create() {
            return new RouterCommand.Builder();
        }

        withFactory(serviceFactory: ServiceFactory) {
            this.serviceFactory = serviceFactory;
            return this;
        }

        withRoute(route: string) {
            this.route = route;
            return this;
        }

        withParameters(parameters: {[key: string]: string}) {
            this.parameters = parameters;
            return this;
        }

        build() {
            return new RouterCommand(this.serviceFactory!, this.route, this.parameters);
        }
    }
}