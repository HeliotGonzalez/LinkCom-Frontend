import {Routes} from '@angular/router';
import {UserRegisterComponent} from './user-register/user-register.component';
import {LoginComponent} from './login/login.component';
import {HeaderComponent} from './header/header.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomepageComponent} from './homepage/homepage.component';
import {NoAuthGuard} from './guards/no-auth.guard';
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
import {
    SecondStepEventCreationComponent
} from "./event-creation/second-step-event-creation/second-step-event-creation.component";
import {ModeratorsManagementComponent} from "./moderators-management/moderators-management.component";
import {CommunityViewComponent} from "./community-view/community-view.component";
import {ComunitiesComponent} from './comunities/comunities.component';
import {EventsCommunityCalendarComponent} from "./events-community-calendar/events-community-calendar.component";
import { AnnouncementCreationComponent } from './announcement-creation/announcement-creation.component';
import { AnnouncementsListComponent } from './announcements-list/announcements-list.component';
import { CommunityEditComponent } from './community-edit/community-edit.component';
import { CommunityRequestsPanelComponent } from './community-requests-panel/community-requests-panel.component';
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

export const routes: Routes = [
    {path: '', component: DashboardComponent, canActivate: [NoAuthGuard]},
    {path: 'header', component: HeaderComponent},
    {path: 'homepage', component: HomepageComponent},
    {path: 'user-register', component: UserRegisterComponent},
    {path: 'login', component: LoginComponent},
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
    {path: 'communityRequestsPanel', component: CommunityRequestsPanelComponent},
    {path: 'editCommunity', component: CommunityEditComponent}, 
    {path: 'profile', component: PersonalProfileComponent, outlet: 'modal'},
    { path: 'edit-profile', component: EditProfileComponent } 
];
