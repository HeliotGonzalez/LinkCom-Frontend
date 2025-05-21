import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {ApiService} from '../../services/api-service.service';
import {AuthService} from '../../services/auth.service';
import {HeaderVisibilityService} from '../../services/header-visibility.service';
import Swal from 'sweetalert2';
import { LanguageService } from '../../language.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
})
export class LoginComponent implements OnInit {
    protected email: string = '';
    protected password: string = '';

    constructor(private http: HttpClient, private router: Router, private apiService: ApiService, private authService: AuthService, private headerService: HeaderVisibilityService, private languageService: LanguageService) {
    }

    onSubmit(): void {
        if (!this.email || !this.password) {
            if (this.languageService.current == 'en'){
                Swal.fire({
                    title: 'Error!',
                    text: 'Please enter email and password.',
                    icon: 'error',
                    confirmButtonText: 'Retry',
                    backdrop: false,
                    customClass: {popup: 'custom-swal-popup'},
                    didOpen: () => {
                        document.body.insertAdjacentHTML(
                            'beforeend',
                            '<div id="blur-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);z-index:2;"></div>'
                        );
                    },
                    didClose: () => {
                        const blurOverlay = document.getElementById('blur-overlay');
                        if (blurOverlay) blurOverlay.remove();
                    }
                });
            } else {
                Swal.fire({
                    title: '¡Error!',
                    text: 'Introduzca su email y contraseña',
                    icon: 'error',
                    confirmButtonText: 'Reintentar',
                    backdrop: false,
                    customClass: {popup: 'custom-swal-popup'},
                    didOpen: () => {
                        document.body.insertAdjacentHTML(
                            'beforeend',
                            '<div id="blur-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);z-index:2;"></div>'
                        );
                    },
                    didClose: () => {
                        const blurOverlay = document.getElementById('blur-overlay');
                        if (blurOverlay) blurOverlay.remove();
                    }
                });
            }

            return;
        }

        const payload = {email: this.email, password: this.password};

        console.log('Payload enviado:', payload);

        const apiUrl = 'http://localhost:3000/login';
        this.http.post(apiUrl, payload).subscribe(
            (response: any) => {
                console.log('User logged in successfully:', response);
                localStorage.setItem('token', response.token);

                this.authService.setToken(response.token);
                this.authService.setUserId(response.userID);
                console.log(response.userID);

                this.router.navigate(['/homepage']);
            },
            (error) => {
                console.error('Error during login:', error);
                if (this.languageService.current == 'en'){
                    Swal.fire({
                        title: 'Error!',
                        text: 'Invalid email or password. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'Retry',
                        backdrop: false,
                        customClass: {popup: 'custom-swal-popup'},
                        didOpen: () => {
                            document.body.insertAdjacentHTML(
                                'beforeend',
                                '<div id="blur-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);z-index:2;"></div>'
                            );
                        },
                        didClose: () => {
                            const blurOverlay = document.getElementById('blur-overlay');
                            if (blurOverlay) blurOverlay.remove();
                        }
                    });
                } else {
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Email o contraseña inválido',
                        icon: 'error',
                        confirmButtonText: 'Reintentar',
                        backdrop: false,
                        customClass: {popup: 'custom-swal-popup'},
                        didOpen: () => {
                            document.body.insertAdjacentHTML(
                                'beforeend',
                                '<div id="blur-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);backdrop-filter:blur(10px);z-index:2;"></div>'
                            );
                        },
                        didClose: () => {
                            const blurOverlay = document.getElementById('blur-overlay');
                            if (blurOverlay) blurOverlay.remove();
                        }
                    });
                }

            }
        );
    }

    setFocus(event: Event, input: HTMLInputElement) {
        event.preventDefault();
        input.focus();
    }

    ngOnInit() {
        this.headerService.hide();
    }

    ngOnDestroy() {
        this.headerService.show();
    }
}