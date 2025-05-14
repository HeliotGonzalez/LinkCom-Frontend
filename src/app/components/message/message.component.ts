import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Message} from "../../../architecture/model/Message";
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-message',
    imports: [
        NgClass
    ],
    templateUrl: './message.component.html',
    standalone: true,
    styleUrl: './message.component.css'
})
export class MessageComponent {
    @Input() message!: Message;
    @Input() own!: boolean;
    @Input() isRemoving: boolean = false;
    @Output() removeEmitter = new EventEmitter<string>();
    @Output() addToRemoveListEmitter = new EventEmitter<string>();

    getClass() {
        return this.own ? 'align-items-end' : 'align-items-start';
    }

    deserializeDate(dateString: string) {
        const date = new Date(dateString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }

    protected readonly Date = Date;

    removeMessage() {
        this.removeEmitter.emit(this.message.id);
    }

    deserialize(text: string) {
        return decodeURIComponent(text);
    }

    addToRemoveList() {
        this.addToRemoveListEmitter.emit(this.message.id);
    }
}
