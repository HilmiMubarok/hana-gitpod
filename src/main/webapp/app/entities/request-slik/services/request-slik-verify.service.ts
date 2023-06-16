import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikVerifyService {
  originalVerifyData = new BehaviorSubject<any>([]);
  originalVerifyData$ = this.originalVerifyData.asObservable();

  verifyChecklistsData = new BehaviorSubject<any>([]);
  verifyChecklistsData$ = this.verifyChecklistsData.asObservable();

  setVerifyChecklistsData(data: any) {
    this.verifyChecklistsData.next(data);
  }

  setOriginalVerifyData(data: any) {
    const currentData = this.originalVerifyData.getValue();
    currentData.push(data);
    this.originalVerifyData.next(currentData);
  }
}
