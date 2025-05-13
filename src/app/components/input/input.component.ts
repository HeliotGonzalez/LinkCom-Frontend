import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-input',
    imports: [
        FormsModule
    ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
    @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('form') formRef!: ElementRef<HTMLFormElement>;
    @Output() sendMessageEmitter = new EventEmitter<string>();

    protected body: string = '';

    ngAfterViewInit() {
        this.autoResize();
    }

    autoResize(event?: Event) {
        const textarea = (event?.target as HTMLTextAreaElement) || this.textareaRef.nativeElement;
        const form = this.formRef.nativeElement;
        if (!textarea || !form) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        this.adjustFormHeight();
    }

    private adjustFormHeight() {
        const textarea = this.textareaRef.nativeElement;
        const form = this.formRef.nativeElement;
        const maxHeight = parseFloat(getComputedStyle(form).maxHeight);
        const formHeight = Math.min(textarea.scrollHeight + 20, maxHeight);
        form.style.height = `${formHeight}px`;
    }

    send() {
        this.sendMessageEmitter.emit(this.body);
        this.body = '';
        const textarea = this.textareaRef.nativeElement;
        textarea.textContent = null;
        this.adjustFormHeight();
        this.textareaRef.nativeElement.value = '';
    }
}
