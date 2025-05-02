import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-image-dialog',
    imports: [
        NgClass
    ],
    templateUrl: './image-dialog.component.html',
    styleUrl: './image-dialog.component.css'
})
export class ImageDialogComponent {
    @Input() isVisible: boolean = false;
    @Input() imageUrl: string | null | undefined = null;
    @Output() close = new EventEmitter<void>();

    closeDialog(event: Event) {
        if ((event.target as HTMLElement).id === 'imageDialog') {
            this.close.emit();
        }
    }
}
