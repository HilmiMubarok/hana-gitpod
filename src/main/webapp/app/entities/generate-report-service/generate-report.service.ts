import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenerateReportService {
  private dataReportDraftSubject = new BehaviorSubject<object[]>([]);
  dataReportDraft$ = this.dataReportDraftSubject.asObservable();
  setDataReportDraft(data: object[]): void {
    this.dataReportDraftSubject.next(data);
  }
}
