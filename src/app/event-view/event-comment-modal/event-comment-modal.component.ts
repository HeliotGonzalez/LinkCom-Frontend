import { NgIf } from '@angular/common';
import {
    Component, Input, Output, EventEmitter,
    AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges
  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../architecture/model/Comment';

  declare var bootstrap: any;
  
  @Component({
    selector: 'app-event-comment-modal',
    standalone: true,
    templateUrl: './event-comment-modal.component.html',
    styleUrl: './event-comment-modal.component.css',
    imports: [FormsModule, NgIf]
  })
  export class EventCommentModalComponent implements AfterViewInit, OnChanges {
    @Input() visible = false;
    @Input() eventID!: string;
    @Input() userID!: string;

    @Output() closed = new EventEmitter<void>();
    @Output() commentSubmitted = new EventEmitter<Comment>();
    @Input() comments: string[] = [];
    @ViewChild('modal') modalRef!: ElementRef;
    commentText: string = '';
  
    private modalInstance: any;
  
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
  