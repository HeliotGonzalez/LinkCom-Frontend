import { NgFor, NgIf } from '@angular/common';
import {Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges, ViewChildren, QueryList} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../architecture/model/Comment';
import { AuthService } from '../../services/auth.service';
import { ServiceFactory } from '../../services/api-services/ServiceFactory.service';
import { Notify } from '../../services/notify';
import { ApiService }   from '../../services/api-service.service';
import { User } from '../../../architecture/model/User';
import { WebSocketFactory } from '../../services/api-services/WebSocketFactory.service';
import { Lang, LanguageService } from '../../language.service';
import { UserService } from '../../../architecture/services/UserService';
declare var bootstrap: any;

@Component({
    selector: 'app-event-comment-modal',
    standalone: true,
    templateUrl: './event-comment-modal.component.html',
    styleUrl: './event-comment-modal.component.css',
    imports: [FormsModule, NgIf, NgFor]
})
export class EventCommentModalComponent implements AfterViewInit, OnChanges {
    @Input() visible = false;
    @Input() eventID!: string;
    userID!: string;
    @ViewChild('withScroll') private withScroll!: ElementRef;
    @ViewChildren('item') private itemsElements!: QueryList<ElementRef>;

    @Output() closed = new EventEmitter<void>();
    @Output() commentSubmitted = new EventEmitter<Comment>();
    @Input() comments: { [id: string]: Comment } = {};
    @ViewChild('modal') modalRef!: ElementRef;
    user!: User
    saving = false;
    profileForm: any;
    loadingComments = true;
    commentText: string = '';

    protected readonly Object = Object;
    private modalInstance: any;


    constructor(
      private authService: AuthService,
      private serviceFactory: ServiceFactory,
      private api: ApiService,
      private notify: Notify,
      private socketFactory: WebSocketFactory,
      private languageService: LanguageService
    ) {
      this.userID = this.authService.getUserUUID();
      (this.serviceFactory.get('users') as UserService).getUser(this.userID).subscribe(res => {
        this.user = res.data[0];
      });
    }
    

    ngOnInit() {
      this.fetchComments();
      this.initializeSocket();
    }

    ngAfterViewInit() {
        this.itemsElements.changes.subscribe(() => this.scrollToBottom());
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
                this.comments = comments.reduce((acc: { [id: string]: Comment }, comment: Comment) => {
                    acc[comment.id!] = comment;
                    return acc;
                }, {});
                this.loadingComments = false;
            },
            error: (err: any) => {
                this.loadingComments = false;
                if (this.languageService.current == 'en') this.notify.error(`We have problems getting the comments: ${err.message}`);
                else this.notify.error(`Hemos encontrado un error al obtener los comentarios: ${err.message}`);
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
                userID: this.userID,
                username: this.user.username,
            });
        }
    }

    onDeleteComment(comment: Comment) {
        if (comment.eventID !== this.eventID) return;
        delete this.comments[comment.id!];
    }

    async onInsertComment(comment: Comment) {
        comment.username = await this.fetchUsername(comment.userID);
        if (comment.eventID !== this.eventID) return;
        this.comments[comment.id!] = comment;
        this.commentText = ''; // Clear the input field when the modal is closed

    }

    private initializeSocket() {
        const socket = this.socketFactory.get('Comments');
        socket.onDelete().subscribe(res => this.onDeleteComment(res.old as Comment));
        socket.onInsert().subscribe(res => this.onInsertComment(res.new as Comment));
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

    private scrollToBottom() {
        this.withScroll.nativeElement.scrollTop = this.withScroll.nativeElement.scrollHeight;
    }
    
}
