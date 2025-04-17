import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import {HTTPCommunityService} from "./app/services/api-services/h-t-t-p-community.service";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: 'CommunityService', useClass: HTTPCommunityService }
  ],
}).catch((err) => console.error(err));