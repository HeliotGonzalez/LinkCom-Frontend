import {Component} from '@angular/core';
import {RouterModule, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-header',
    imports: [RouterModule],
    templateUrl: './header.component.html',
    standalone: true,
    styleUrl: './header.component.css'
})

export class HeaderComponent {
    user: any;

    constructor(protected authService: AuthService, private router: Router) {
        this.user = this.authService.getUserUUID();
    };

    logout() {
        this.authService.logout();
        this.user = this.authService.getUserUUID();
        this.router.navigate(['/']);
    }

    goToUsersList() {
        this.router.navigate(['users-list']);
    }

    goToProfile() {
        this.router.navigate([{outlets: {modal: ['profile', this.user]}}]);
    }
}
