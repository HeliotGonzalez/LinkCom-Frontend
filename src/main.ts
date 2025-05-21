// src/main.ts
/// <reference types="@angular/localize" />
import { bootstrapApplication } from '@angular/platform-browser';
import '@angular/localize/init';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { LOCALE_ID, importProvidersFrom } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { loadTranslations } from '@angular/localize';

import { LanguageService } from './app/language.service';

async function main() {
  const langSvc = new LanguageService();
  const lang = langSvc.current; 

  registerLocaleData(lang === 'es' ? localeEs : localeEn);

  const resp = await fetch(`/assets/i18n/${lang}.json`);
  const { translations } = await resp.json();
  loadTranslations(translations);

  await bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(),
      provideAnimationsAsync(),
      { provide: LOCALE_ID, useValue: lang === 'es' ? 'es-ES' : 'en-US' },
      importProvidersFrom()
    ]
  });
}

main().catch(err => console.error(err));
