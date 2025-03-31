import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private filledFormData: { [key: string]: any } = {};
  private formDataSubject = new BehaviorSubject<{ [key: string]: any }>({});
  data$ = this.formDataSubject.asObservable();

  constructor() { }

  put(key: string, value: any) {
    this.filledFormData[key] = value;
  }

  get(key: string) {
    return this.filledFormData[key];
  }

  update() {
    this.formDataSubject.next(this.filledFormData);
  }

  remove(key: any) {
    let removedValue = this.get(key);
    delete this.filledFormData[key];
    return removedValue
  }
}
