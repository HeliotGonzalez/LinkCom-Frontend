import {ApiService} from "../services/api-service.service";
import Swal from "sweetalert2";
import {Community} from "../interfaces/community";

export class ApiServiceTranslator {
    constructor(private apiService: ApiService) {
    }

    joinCommunity(community: Community, userID: string) {
        this.apiService.joinCommunity(userID, community.id).subscribe({
            next: () => {
                Swal.fire({
                    title: "Success!",
                    text: `Welcome to ${community.name} community!`,
                    icon: "success"
                });
            },
            error: () => {
                Swal.fire({
                    title: "An error occurred!",
                    text: `We could not add you to ${community.name} community! Please, try again later.`,
                    icon: "error"
                });
            }
        });
    }
}