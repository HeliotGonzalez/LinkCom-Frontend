import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from './app/root.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(RootComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule), // Add HttpClientModule here
  ],
}).catch((err) => console.error(err));