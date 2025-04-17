import {Notify} from "../services/notify";
import {ApiResponse} from "../interfaces/ApiResponse";
import {Observable} from "rxjs";

export class ApiServiceTranslator {
    constructor(private alertService: Notify) {
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