import { Routes } from '@angular/router';
import { EventsCommunityCalendarComponent } from './events-community-calendar/events-community-calendar.component';
import { ComunitiesComponent } from './comunities/comunities.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

export const routes: Routes = [
    {path:"", component:ComunitiesComponent}
];
