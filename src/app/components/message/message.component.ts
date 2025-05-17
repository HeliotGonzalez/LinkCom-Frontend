import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Message} from "../../../architecture/model/Message";
import {NgClass} from "@angular/common";
import {TextDeserializer} from "../../../architecture/io/TextDeserializer";

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
    @Output() removeEmitter = new EventEmitter<boolean>();
    @Output() addToRemoveListEmitter = new EventEmitter<string>();
    @Output() removeFromRemoveListEmitter = new EventEmitter<string>();
    protected remove: boolean = false;

    getClass() {
        return {
            [this.own ? 'align-items-end' : 'align-items-start']: true,
            'remove': this.remove
        };
    }

    deserializeDate(dateString: string) {
        const date = new Date(dateString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }

    protected readonly Date = Date;

    removeMessage() {
        this.isRemoving = !this.isRemoving;
        this.removeEmitter.emit(this.isRemoving);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isRemoving']) this.isRemoving = changes['isRemoving'].currentValue;
        if (!this.isRemoving) this.remove = false;
    }

    deserialize(text: string) {
        return TextDeserializer.deserialize(text);
    }

    addToRemoveList() {
        if (!this.isRemoving || !this.own || this.message.deleted_at) return;
        this.remove = !this.remove;
        if (this.remove) this.addToRemoveListEmitter.emit(this.message.id);
        else this.removeFromRemoveListEmitter.emit(this.message.id);
    }
}
