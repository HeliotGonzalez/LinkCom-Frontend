import {Injectable} from '@angular/core';
import Swal, {SweetAlertOptions} from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class Notify {

    constructor() {
    }

    info(title: string, msg: string) {
        Swal.fire(title, msg, 'info');
    }

    success(msg: string) {
        Swal.fire('Success!', msg, 'success');
    }

    error(msg: string, title: string = 'An error occurred') {
        Swal.fire(title, msg, 'error');
    }

    async confirm(message: string): Promise<boolean> {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No, cancel!'
        });
        return result.isConfirmed;
    }
}
