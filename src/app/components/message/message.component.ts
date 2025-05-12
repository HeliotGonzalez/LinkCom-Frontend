import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Message} from "../../../architecture/model/Message";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-message',
    imports: [
        NgClass
    ],
    templateUrl: './message.component.html',
    styleUrl: './message.component.css'
})
export class MessageComponent {
    @Input() message!: Message;
    @Input() own!: boolean;
    @Output() removeEmitter = new EventEmitter<string>();

    ngOnInit() {
        console.log(this.message);
    }

    getClass() {
        return this.own ? 'align-items-end' : 'align-items-start';
    }

    deserializeDate(dateString: string) {
        const date = new Date(dateString);
        return `${date.getHours().toString()}:${date.getMinutes().toString()}`
    }

    protected readonly Date = Date;

    removeMessage() {
        this.removeEmitter.emit(this.message.id);
    }
}
