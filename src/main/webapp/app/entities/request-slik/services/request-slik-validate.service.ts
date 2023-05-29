import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikValidateService {
  private documentLength = new BehaviorSubject<number>(0);

  setDocumentLength(length: number) {
    this.documentLength.next(length);
  }

  // Should validated is minimum document: 1
  private minimumDocument = 1;

  validate() {
    return this.documentLength.value >= this.minimumDocument ? true : false;
  }
}

export interface IRequestSlikValidateData {
  document: boolean;
}
