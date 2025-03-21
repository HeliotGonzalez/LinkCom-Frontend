import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
    {path: '', component: DashboardComponent, canActivate: [NoAuthGuard]},
    {path: 'header', component: HeaderComponent},
    {path: 'homepage', component: HomepageComponent}
];
