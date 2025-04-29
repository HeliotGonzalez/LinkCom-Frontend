import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterFirstStepComponent } from './user-register/register-first-step/register-first-step.component';
import { RegisterSecondStepComponent } from './user-register/register-second-step/register-second-step.component';
import { RegisterThirdStepComponent } from './user-register/register-third-step/register-third-step.component';

export const routes: Routes = [
  { path: '', component: RegisterFirstStepComponent },
  { path: 'user-register/firstStep', component: RegisterFirstStepComponent },
  { path: 'user-register/secondStep', component: RegisterSecondStepComponent },
  { path: 'user-register/thirdStep', component: RegisterThirdStepComponent },
  { path: 'login', component: LoginComponent }
];
