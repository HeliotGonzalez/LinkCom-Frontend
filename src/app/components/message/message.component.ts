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
        this.hour = `${new Date(this.message.created_at).getHours().toString()}:${new Date(this.message.created_at).getMinutes().toString()}`;
    }

    getClass() {
        return this.own ? 'align-items-end' : 'align-items-start';
    }

    protected readonly Date = Date;
    hour!: string;

    removeMessage() {
        this.removeEmitter.emit(this.message.id);
    }
}
