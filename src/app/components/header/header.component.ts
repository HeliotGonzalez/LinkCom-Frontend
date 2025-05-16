import {Component} from '@angular/core';
import {RouterModule, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LanguageService, Lang } from '../../language.service';

@Component({
    selector: 'app-header',
    imports: [RouterModule, CommonModule],
    templateUrl: './header.component.html',
    standalone: true,
    styleUrl: './header.component.css'
})

export class HeaderComponent {
    user: any;
    lang: 'en' | 'es' = 'en';
    currentLang: Lang;

    constructor(protected authService: AuthService, private router: Router, private languageService: LanguageService) {
        this.user = this.authService.getUserUUID();
        this.currentLang = this.languageService.current;
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

    switchLang(lang: Lang) {
        if (lang !== this.currentLang) this.languageService.current = lang;
    }
}
