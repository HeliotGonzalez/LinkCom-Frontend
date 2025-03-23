import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunityFormService {
  private pageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.pageSubject.asObservable();

  changePage(page: number) {
    this.pageSubject.next(page);
  }
}
