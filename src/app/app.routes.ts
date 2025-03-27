import { Routes } from '@angular/router';
import { UserRegisterComponent } from './user-register/user-register.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: UserRegisterComponent },
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'login', component: LoginComponent }
];
