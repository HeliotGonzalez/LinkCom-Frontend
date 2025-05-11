import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
    @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('form') formRef!: ElementRef<HTMLFormElement>;

    ngAfterViewInit() {
        // Ajustar la altura al principio
        this.autoResize();
    }

    autoResize(event?: Event) {
        const textarea = (event?.target as HTMLTextAreaElement) || this.textareaRef.nativeElement;
        const form = this.formRef.nativeElement;

        if (!textarea || !form) return;

        // Ajustamos la altura del textarea según su contenido
        textarea.style.height = 'auto'; // Restablecemos la altura para ajustar correctamente
        textarea.style.height = `${textarea.scrollHeight}px`;

        // Ajustamos la altura del formulario para que se ajuste al tamaño del textarea
        this.adjustFormHeight();
    }

    private adjustFormHeight() {
        const textarea = this.textareaRef.nativeElement;
        const form = this.formRef.nativeElement;

        // La altura máxima está definida en el CSS del textarea
        const maxHeight = parseFloat(getComputedStyle(form).maxHeight);

        // Limitar la altura del formulario para que no supere la altura del textarea
        const formHeight = Math.min(textarea.scrollHeight + 20, maxHeight);

        form.style.height = `${formHeight}px`;
    }
}
