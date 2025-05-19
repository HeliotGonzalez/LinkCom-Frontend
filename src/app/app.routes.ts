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
import { CommunityEditComponent } from './pages/community-edit/community-edit.component';
import { PersonalProfileComponent } from './components/personal-profile/personal-profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import {MessagesComponent} from "./pages/messages/messages.component";
import {EventsRequestPanelComponent} from "./components/events-request-panel/events-request-panel.component";

export const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'homepage', component: HomepageComponent, canActivate: [NoAuthGuard]},
    {path: 'user-register/firstStep', component: RegisterFirstStepComponent},
    {path: 'user-register/secondStep', component: RegisterSecondStepComponent},
    {path: 'user-register/thirdStep', component: RegisterThirdStepComponent},
    {path: 'login', component: LoginComponent},
    {path: 'firstStepCommunityCreation', component: FirstStepCommunityCreationComponent, canActivate: [NoAuthGuard]},
    {path: 'secondStepCommunityCreation', component: SecondStepCommunityCreationComponent, canActivate: [NoAuthGuard]},
    {path: 'thirdStepCommunityCreation', component: ThirdStepCommunityCreationComponent, canActivate: [NoAuthGuard]},
    {path: 'firstStepEventCreation', component: FirstStepEventCreationComponent, canActivate: [NoAuthGuard]},
    {path: 'secondStepEventCreation', component: SecondStepEventCreationComponent, canActivate: [NoAuthGuard]},
    {path: 'moderatorsManagement', component: ModeratorsManagementComponent, canActivate: [NoAuthGuard]},
    {path: 'community/:id', component: CommunityViewComponent, canActivate: [NoAuthGuard]},
    {path: 'communities', component: ComunitiesComponent, canActivate: [NoAuthGuard]},
    {path: 'calendar', component: EventsCommunityCalendarComponent, canActivate: [NoAuthGuard]},
    {path: 'announcementCreation', component: AnnouncementCreationComponent, canActivate: [NoAuthGuard]},
    {path: 'moderators', component: ModeratorsManagementComponent, canActivate: [NoAuthGuard]},
    {path: 'announcementsList', component: AnnouncementsListComponent, canActivate: [NoAuthGuard]},
    {path: '', component: DashboardComponent, canActivate: [NoAuthGuard]},
    {path: 'header', component: HeaderComponent},
    {path: 'announcementCreation', component: AnnouncementCreationComponent},
    {path: 'announcementsList', component: AnnouncementsListComponent},
    {path: 'communityRequestsPanel', component: CommunityRequestsPanelComponent},
    {path: 'editCommunity', component: CommunityEditComponent},
    {path: 'profile/:id', component: PersonalProfileComponent, outlet: 'modal'},
    {path: 'communityRequestsPanel/:id', component: CommunityRequestsPanelComponent, outlet: 'modal'},
    {path: 'eventsRequestPanel/:id', component: EventsRequestPanelComponent, outlet: 'modal'},
    {path: 'edit-profile', component: EditProfileComponent },
    {path: 'users-list', component: UsersListComponent},
    {path: 'messages', component: MessagesComponent},
    {path: 'messages/:id', component: MessagesComponent}
];
