import {ServiceFactory} from "../services/api-services/ServiceFactory.service";
import {Message} from "../../architecture/model/Message";
import {Command} from "../../architecture/control/Command";
import {MessageService} from "../../architecture/services/MessageService";
import {NotificationType} from "../../architecture/model/NotificationType";
import {NotificationService} from "../../architecture/services/NotificationService";

export class SendMessageCommand implements Command {
    constructor(
        private serviceFactory: ServiceFactory,
        private message: Message
    ) {
    }

    execute() {
        (this.serviceFactory.get('messages') as MessageService).send(this.message).subscribe(res => {
            (this.serviceFactory.get('notifications') as NotificationService).send({
                recipientID: res.data[0].to,
                relatedID: res.data[0].id!,
                type: NotificationType.MESSAGE
            }).subscribe();
        });
    }

    static Builder = class {
        private factory: ServiceFactory | null = null;
        private message: Message | null = null;

        private constructor() {
        }

        static create() {
            return new SendMessageCommand.Builder();
        }

        withFactory(factory: ServiceFactory) {
            this.factory = factory;
            return this;
        }

        withMessage(message: Message) {
            this.message = message;
            return this;
        }

        build() {
            return new SendMessageCommand(this.factory!, this.message!);
        }
    }
}