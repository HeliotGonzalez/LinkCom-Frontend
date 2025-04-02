import { Routes } from '@angular/router';
import { UserRegisterComponent } from './user-register/user-register.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import {
  FirstStepCommunityCreationComponent
} from './community-creation/first-step-community-creation/first-step-community-creation.component';
import {
  SecondStepCommunityCreationComponent
} from './community-creation/second-step-community-creation/second-step-community-creation.component';
import {
  ThirdStepCommunityCreationComponent
} from './community-creation/third-step-community-creation/third-step-community-creation.component';
import {
  FirstStepEventCreationComponent
} from './event-creation/first-step-event-creation/first-step-event-creation.component';
import {SecondStepEventCreationComponent} from "./event-creation/second-step-event-creation/second-step-event-creation.component";
import {ModeratorsManagementComponent} from "./moderators-management/moderators-management.component";

export const routes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [NoAuthGuard]},
  {path: 'header', component: HeaderComponent},
  {path: 'homepage', component: HomepageComponent},
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'login', component: LoginComponent },
  {path: 'firstStepCommunityCreation', component: FirstStepCommunityCreationComponent},
  {path: 'secondStepCommunityCreation', component: SecondStepCommunityCreationComponent},
  {path: 'thirdStepCommunityCreation', component: ThirdStepCommunityCreationComponent},
  {path: 'firstStepEventCreation', component: FirstStepEventCreationComponent},
  {path: 'secondStepEventCreation', component: SecondStepEventCreationComponent},
  {path: 'moderatorsManagement', component: ModeratorsManagementComponent}
];
