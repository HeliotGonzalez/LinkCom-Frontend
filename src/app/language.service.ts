import { Injectable } from '@angular/core';

export type Lang = 'en' | 'es';
const DEFAULT_LANG: Lang = 'en';
const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  get current(): Lang {
    return (localStorage.getItem(STORAGE_KEY) as Lang) ?? DEFAULT_LANG;
  }

  set current(lang: Lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    window.location.reload();
  }
}
