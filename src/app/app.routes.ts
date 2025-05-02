import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HeaderComponent} from './header/header.component';
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
<<<<<<< HEAD
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
<<<<<<< HEAD
>>>>>>> ad5282f (feat: User profile is visible)
=======
import { EditProfileComponent } from './edit-profile/edit-profile.component';
>>>>>>> 2426d70 (feat: A user can edit their data)
=======
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
>>>>>>> 45cb51e (refactor: New directory hierarchy.)

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
<<<<<<< HEAD
    {path: 'communityRequestsPanel', component: CommunityRequestsPanelComponent}
=======
    {path: 'editCommunity', component: CommunityEditComponent}
>>>>>>> 909b589 (feat: A user, who is leader, can edit an existing Community)
=======
    {path: 'communityRequestsPanel', component: CommunityRequestsPanelComponent},
    {path: 'editCommunity', component: CommunityEditComponent}, 
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> a55b898 (feat: Community edit)
=======
    {path: 'profile', component: PersonalProfileComponent, outlet: 'modal'}
>>>>>>> ad5282f (feat: User profile is visible)
=======
    {path: 'profile', component: PersonalProfileComponent, outlet: 'modal'},
    { path: 'edit-profile', component: EditProfileComponent } 
>>>>>>> 2426d70 (feat: A user can edit their data)
=======
>>>>>>> 45cb51e (refactor: New directory hierarchy.)
];
