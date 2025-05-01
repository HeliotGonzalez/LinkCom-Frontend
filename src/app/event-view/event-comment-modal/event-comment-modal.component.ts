<<<<<<< HEAD
<<<<<<< HEAD
import { NgFor, NgIf } from '@angular/common';
import {Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../architecture/model/Comment';
import { AuthService } from '../../services/auth.service';
import { ServiceFactory } from '../../services/api-services/ServiceFactory.service';
import { Notify } from '../../services/notify';
import { ApiService }   from '../../services/api-service.service';
import { User } from '../../../architecture/model/User';
import { WebSocketFactory } from '../../services/api-services/WebSocketFactory.service';
declare var bootstrap: any;

@Component({
=======
=======
import { NgIf } from '@angular/common';
>>>>>>> 6521e6d (Fixed somethigns)
import {
    Component, Input, Output, EventEmitter,
    AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges
  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../architecture/model/Comment';
import { AuthService } from '../../services/auth.service';
  declare var bootstrap: any;
  
  @Component({
>>>>>>> 6a3686a (feat: added comments modal and button to delete comments)
    selector: 'app-event-comment-modal',
    standalone: true,
    templateUrl: './event-comment-modal.component.html',
    styleUrl: './event-comment-modal.component.css',
<<<<<<< HEAD
<<<<<<< HEAD
    imports: [FormsModule, NgIf, NgFor]
})
export class EventCommentModalComponent implements AfterViewInit, OnChanges {
    @Input() visible = false;
    @Input() eventID!: string;
    userID!: string;

    @Output() closed = new EventEmitter<void>();
    @Output() commentSubmitted = new EventEmitter<Comment>();
    @Input() comments: Comment[] = [];
    @ViewChild('modal') modalRef!: ElementRef;
    user!: User
    saving = false;
    profileForm: any;
    loadingComments = true;
    commentText: string = '';

    private modalInstance: any;

    constructor(
      private authService: AuthService,
      private serviceFactory: ServiceFactory,
      private api: ApiService,
      private notify: Notify,
      private socketFactory: WebSocketFactory
    ) {
      this.userID = this.authService.getUserUUID();
    }
    

    ngOnInit() {
      this.fetchComments();
    }

    ngAfterViewInit() {
        this.modalInstance = new bootstrap.Modal(this.modalRef.nativeElement);
        this.modalRef.nativeElement.addEventListener('hidden.bs.modal', () => {
            this.closed.emit();
            this.commentText = ''; // Clear the input field when the modal is closed
        });

        if (this.visible) this.modalInstance.show();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.modalInstance) return;

        if (changes['visible']) {
            this.visible ? this.modalInstance.show() : this.modalInstance.hide();
        }

        if (changes['eventID'] && this.eventID) {
            this.fetchComments();
        }
    }



    fetchComments() {
        this.loadingComments = true;
        (this.serviceFactory.get('events') as any).getComments(this.eventID).subscribe({
            next: async (res: any) => {
                const comments: Comment[] = res.data.flat();
    
                const enrichedComments = await Promise.all(comments.map(async (comment: Comment) => {
                    comment.username = await this.fetchUsername(comment.userID);
                    return comment;
                }));
    
                this.comments = enrichedComments;
                this.loadingComments = false;
            },
            error: (err: any) => {
                this.loadingComments = false;
                this.notify.error(`We have problems getting the comments: ${err.message}`);
            }
        });
    }
    

    closeModal() {
        this.modalInstance.hide();
    }

    submitComment() {
        if (this.commentText.trim()) {
            this.commentSubmitted.emit({
                body: this.commentText.trim(),
                eventID: this.eventID,
                userID: this.userID
            });
            this.closeModal();
        }
    }

    async fetchUsername(id: string): Promise<string> {
      let username = '';
      try {
        const res = await this.api.getUserProfile(id).toPromise(); // Convierte el observable a promesa
        this.user = res.data;
        username = this.user.username; // Asumiendo que 'name' es una propiedad del objeto User
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
      return username;
    }
    
}
=======
    imports: [FormsModule]
=======
    imports: [FormsModule, NgIf]
>>>>>>> 6521e6d (Fixed somethigns)
  })
  export class EventCommentModalComponent implements AfterViewInit, OnChanges {
    @Input() visible = false;
    @Input() eventID!: string;
    userID !: string;

    @Output() closed = new EventEmitter<void>();
    @Output() commentSubmitted = new EventEmitter<Comment>();
    @Input() comments: string[] = [];
    @ViewChild('modal') modalRef!: ElementRef;
    commentText: string = '';
  
    private modalInstance: any;
  
      constructor (
        private authService: AuthService
      ) {  
        this.userID = this.authService.getUserUUID();
      }

    ngAfterViewInit() {
      this.modalInstance = new bootstrap.Modal(this.modalRef.nativeElement);
      this.modalRef.nativeElement.addEventListener('hidden.bs.modal', () => {
        this.closed.emit();
        this.commentText = ''; // Limpia el campo al cerrar
      });
  
      if (this.visible) this.modalInstance.show();
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (!this.modalInstance) return;
      if (changes['visible']) {
        this.visible ? this.modalInstance.show() : this.modalInstance.hide();
      }
    }
  
    closeModal() {
      this.modalInstance.hide();
    }
  
    submitComment() {
      if (this.commentText.trim()) {
        this.commentSubmitted.emit({
          body: this.commentText.trim(),
          eventID: this.eventID,
          userID: this.userID
        });
        this.closeModal();
      }
    }
    
  }
  
>>>>>>> 6a3686a (feat: added comments modal and button to delete comments)
