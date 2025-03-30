import { Routes } from '@angular/router';
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

export const routes: Routes = [
  {path: '', component: FirstStepCommunityCreationComponent},
  {path: 'firstStepCommunityCreation', component: FirstStepCommunityCreationComponent},
  {path: 'secondStepCommunityCreation', component: SecondStepCommunityCreationComponent},
  {path: 'thirdStepCommunityCreation', component: ThirdStepCommunityCreationComponent},
  {path: 'firstStepEventCreation', component: FirstStepEventCreationComponent},
  {path: 'secondStepEventCreation', component: SecondStepEventCreationComponent}
];
