import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApprovalDebtorCorporateService {
  constructor() {}

  private triggeredSave$ = new BehaviorSubject<boolean>(false);
  public triggeredSave = this.triggeredSave$.asObservable();

  private approvalDebtorConditions$ = new BehaviorSubject<any>(null);
  public approvalDebtorConditions = this.approvalDebtorConditions$.asObservable();

  setTriggeredSave(value: boolean) {
    this.triggeredSave$.next(value);
  }

  setApprovalDebtorConditions(value: any) {
    this.approvalDebtorConditions$.next(value);
  }
}
