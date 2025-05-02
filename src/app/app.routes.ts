import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HeaderComponent} from './components/header/header.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {HomepageComponent} from './pages/homepage/homepage.component';
import {NoAuthGuard} from './guards/no-auth.guard';
import {
    FirstStepCommunityCreationComponent
} from './pages/community-creation/first-step-community-creation/first-step-community-creation.component';
import {
    SecondStepCommunityCreationComponent
} from './pages/community-creation/second-step-community-creation/second-step-community-creation.component';
import {
    ThirdStepCommunityCreationComponent
} from './pages/community-creation/third-step-community-creation/third-step-community-creation.component';
import {
    FirstStepEventCreationComponent
} from './pages/event-creation/first-step-event-creation/first-step-event-creation.component';
import {
    SecondStepEventCreationComponent
} from "./pages/event-creation/second-step-event-creation/second-step-event-creation.component";
import {ModeratorsManagementComponent} from "./pages/moderators-management/moderators-management.component";
import {CommunityViewComponent} from "./pages/community-view/community-view.component";
import {ComunitiesComponent} from './pages/comunities/comunities.component';
import {EventsCommunityCalendarComponent} from "./pages/events-community-calendar/events-community-calendar.component";
import { AnnouncementCreationComponent } from './pages/announcement-creation/announcement-creation.component';
import { AnnouncementsListComponent } from './pages/announcements-list/announcements-list.component';
import {CommunityRequestsPanelComponent} from "./components/community-requests-panel/community-requests-panel.component";
import { RegisterFirstStepComponent } from './pages/user-register/register-first-step/register-first-step.component';
import { RegisterSecondStepComponent } from './pages/user-register/register-second-step/register-second-step.component';
import { RegisterThirdStepComponent } from './pages/user-register/register-third-step/register-third-step.component';

export const routes: Routes = [
    {path: '', component: DashboardComponent, canActivate: [NoAuthGuard]},
    {path: 'header', component: HeaderComponent},
    {path: 'homepage', component: HomepageComponent},
    {path: 'user-register/firstStep', component: RegisterFirstStepComponent },
    {path: 'user-register/secondStep', component: RegisterSecondStepComponent },
    {path: 'user-register/thirdStep', component: RegisterThirdStepComponent },
    {path: 'login', component: LoginComponent },
    {path: 'firstStepCommunityCreation', component: FirstStepCommunityCreationComponent},
    {path: 'secondStepCommunityCreation', component: SecondStepCommunityCreationComponent},
    {path: 'thirdStepCommunityCreation', component: ThirdStepCommunityCreationComponent},
    {path: 'firstStepEventCreation', component: FirstStepEventCreationComponent},
    {path: 'secondStepEventCreation', component: SecondStepEventCreationComponent},
    {path: 'moderatorsManagement', component: ModeratorsManagementComponent},
    {path: 'community', component: CommunityViewComponent},
    {path: 'communities', component: ComunitiesComponent},
    {path: 'calendar', component: EventsCommunityCalendarComponent},
    {path: 'announcementCreation', component: AnnouncementCreationComponent},
    {path: 'moderators', component: ModeratorsManagementComponent},
    {path: 'announcementsList', component: AnnouncementsListComponent},
];
