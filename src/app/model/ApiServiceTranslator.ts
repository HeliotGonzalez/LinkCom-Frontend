import {AlertService} from "../services/alert.service";
import {ApiResponse} from "../interfaces/ApiResponse";
import {Observable} from "rxjs";

export class ApiServiceTranslator {
    constructor(private alertService: AlertService) {
    }

    public dualResponse(response: Observable<any>, successMessage: string, errorMessage: string) {
        response.subscribe({
            next: res => {
                this.alertService.success(successMessage);
            },
            error: res => {
                this.alertService.error(`${errorMessage}: ${(res as ApiResponse<any>).message}`);
            }
        })
    }
}