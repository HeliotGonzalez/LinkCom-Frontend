import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../architecture/model/Comment';  // Asegúrate de importar la estructura de los comentarios

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent {
  @Input() comments: Comment[] = [];  // Recibe los comentarios del componente padre
  @Input() isVisible: boolean = false;  // Determina si el modal es visible
  @Output() closeModal = new EventEmitter<void>();  // Emitir evento para cerrar el modal

  close() {
    this.closeModal.emit();  // Cierra el modal cuando se emite el evento
  }
}
