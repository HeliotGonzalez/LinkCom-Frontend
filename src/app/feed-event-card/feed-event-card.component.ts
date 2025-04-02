import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunityEvent} from "../interfaces/CommunityEvent";


@Component({
    selector: 'app-feed-event-card',
    imports: [],
    templateUrl: './feed-event-card.component.html',
    styleUrl: './feed-event-card.component.css'
})
export class FeedEventCardComponent {
    @Input() event: CommunityEvent | null = null;
    @Output() joinEventEmitter = new EventEmitter<CommunityEvent>;

    constructor() {
    }

    joinEvent() {
        this.joinEventEmitter.emit(this.event!);
    }
}
