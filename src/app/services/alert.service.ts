import {Injectable} from '@angular/core';
import Swal, {SweetAlertOptions} from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor() {
    }

    success(msg: string) {
        Swal.fire('Success!', msg, 'success');
    }

    error(msg: string) {
        Swal.fire('An error occurred!', msg, 'error');
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
