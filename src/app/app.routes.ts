import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterScreenComponent } from './register-screen/register-screen.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' }, // Default route redirects to 'register'
  { path: 'register', component: RegisterScreenComponent }, // Route for the register page
];


