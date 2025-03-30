import { Routes } from '@angular/router';
import { UserRegisterComponent } from './user-register/user-register.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [NoAuthGuard]},
  {path: 'header', component: HeaderComponent},
  {path: 'homepage', component: HomepageComponent},
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'login', component: LoginComponent }
];
