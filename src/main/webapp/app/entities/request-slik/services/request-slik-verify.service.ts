import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikVerifyService {
  originalVerifyData = new BehaviorSubject<any>([]);
  originalVerifyData$ = this.originalVerifyData.asObservable();

  setOriginalVerifyData(data: any) {
    const currentData = this.originalVerifyData.getValue();
    currentData.push(data);
    this.originalVerifyData.next(currentData);
  }
}
