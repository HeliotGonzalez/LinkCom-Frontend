import {Injectable} from '@angular/core';
import Swal, {SweetAlertOptions} from "sweetalert2";
import { LanguageService } from '../language.service';

@Injectable({
    providedIn: 'root'
})
export class Notify {

    constructor(private languageService: LanguageService) {
    }

    info(title: string, msg: string) {
        Swal.fire(title, msg, 'info');
    }

    success(msg: string) {
        if (this.languageService.current == 'en') Swal.fire('Success!', msg, 'success');
        else Swal.fire('¡Todo correcto!', msg, 'success')
    }

    error(msg: string, title: string = 'An error occurred') {
        Swal.fire(title, msg, 'error');
    }

    async confirm(message: string): Promise<boolean> {
        if (this.languageService.current == 'en'){
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No, cancel!'
            });
            return result.isConfirmed;
        } else {
            const result = await Swal.fire({
                title: '¿Seguro?',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, estoy seguro',
                cancelButtonText: 'Cancelar'
            });
            return result.isConfirmed;
        }

    }
}
