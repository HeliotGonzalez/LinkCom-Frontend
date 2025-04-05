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

    async confirm(options: SweetAlertOptions): Promise<boolean> {
        const result = await Swal.fire(options);
        return result.isConfirmed;
    }
}
