import {Routes} from '@angular/router';
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
<<<<<<< HEAD
import { AnnouncementCreationComponent } from './announcement-creation/announcement-creation.component';
import { AnnouncementsListComponent } from './announcements-list/announcements-list.component';
<<<<<<< HEAD
import {CommunityRequestsPanelComponent} from "./community-requests-panel/community-requests-panel.component";
import { RegisterFirstStepComponent } from './user-register/register-first-step/register-first-step.component';
import { RegisterSecondStepComponent } from './user-register/register-second-step/register-second-step.component';
import { RegisterThirdStepComponent } from './user-register/register-third-step/register-third-step.component';
=======
import { CommunityEditComponent } from './community-edit/community-edit.component';
>>>>>>> 909b589 (feat: A user, who is leader, can edit an existing Community)
=======
import { CommunityEditComponent } from './community-edit/community-edit.component';
import { CommunityRequestsPanelComponent } from './community-requests-panel/community-requests-panel.component';
<<<<<<< HEAD
>>>>>>> a55b898 (feat: Community edit)
=======
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
>>>>>>> ad5282f (feat: User profile is visible)

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
<<<<<<< HEAD
    {path: 'announcementCreation', component: AnnouncementCreationComponent},
    {path: 'moderators', component: ModeratorsManagementComponent},
    {path: 'announcementsList', component: AnnouncementsListComponent},
<<<<<<< HEAD
    {path: 'communityRequestsPanel', component: CommunityRequestsPanelComponent}
=======
    {path: 'editCommunity', component: CommunityEditComponent}
>>>>>>> 909b589 (feat: A user, who is leader, can edit an existing Community)
=======
    {path: 'communityRequestsPanel', component: CommunityRequestsPanelComponent},
    {path: 'editCommunity', component: CommunityEditComponent}, 
<<<<<<< HEAD
>>>>>>> a55b898 (feat: Community edit)
=======
    {path: 'profile', component: PersonalProfileComponent, outlet: 'modal'}
>>>>>>> ad5282f (feat: User profile is visible)
];
