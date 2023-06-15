import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikValidateService {
  private documentLength = new BehaviorSubject<number>(0);
  private purposeType = new BehaviorSubject<string | null>(null);

  public messages = new BehaviorSubject<Array<string>>([]);
  public messages$: Observable<Array<string>> = this.messages.asObservable();

  // Should validated is minimum document: 1
  private minimumDocument = 1;

  // Should validated purposeType is not ''
  private minimumPurposeType = null;

  setMessages() {
    const messages = [];

    // if documentLength is less than minimum document
    if (this.documentLength.value < this.minimumDocument) {
      messages.push('Minimum document is 1');
    }

    // if purposeType is === this.minimumPurposeType
    if (
      this.purposeType.value === this.minimumPurposeType ||
      typeof this.purposeType.value === 'undefined' ||
      typeof this.purposeType.value === 'object'
    ) {
      messages.push('Purpose type is required');
    }

    this.messages.next(messages);
  }

  setDocumentLength(length: number) {
    this.documentLength.next(length);
    this.setMessages();
  }

  setPurposeType(purposeType: string) {
    this.purposeType.next(purposeType);
    this.setMessages();
  }

  validate() {
    return this.documentLength.value >= this.minimumDocument && this.purposeType.value !== this.minimumPurposeType ? true : false;
  }
}
