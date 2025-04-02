import {Component, Input} from '@angular/core';
import {CommunityEvent} from "../interfaces/CommunityEvent";
import {ImageDialogComponent} from "../image-dialog/image-dialog.component";

@Component({
  selector: 'app-event-view',
    imports: [
        ImageDialogComponent
    ],
  templateUrl: './event-view.component.html',
  styleUrl: './event-view.component.css'
})
export class EventViewComponent {

    @Input() event: CommunityEvent | null = null;
    protected isDialogVisible: boolean = false;
    protected photo: string = "LogoLinkComNegro.svg";

    ngOnInit() {
        console.log(this.event?.imagePath);
    }

    openImageDialog() {
        this.isDialogVisible = true;
    }

    closeImageDialog() {
        this.isDialogVisible = false;
    }
}
