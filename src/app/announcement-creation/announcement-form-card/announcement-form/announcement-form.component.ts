import { Component } from '@angular/core';

@Component({
  selector: 'app-announcement-form',
  imports: [],
  templateUrl: './announcement-form.component.html',
  styleUrl: './announcement-form.component.css'
})
export class AnnouncementFormComponent {

  setFocus(event: Event, input: HTMLInputElement | HTMLTextAreaElement | HTMLDivElement) {
    event.preventDefault();
    input.focus();
  }

  addTag(event: Event, input: HTMLInputElement, container: HTMLDivElement){
    this.setFocus(event, input);
    const tag = document.createElement("button");
    tag.classList.add("tag");
    tag.innerHTML = `<button (click)="removeTag($event, this, ${container})">#${input.value} &times;</button>`;
    container.append(tag);
    input.value = "";
  }

  removeTag(event: Event, button: HTMLButtonElement, container: HTMLDivElement){
    //TO-DO: arreglar método, el evento de formulario prevalece sobre button.remove()
    event.preventDefault();
    button.remove();
  }

}
