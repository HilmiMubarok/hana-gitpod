import { Injectable } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {IParsePreviousAtrribute, parsePreviousAtrribute} from "../../../shared/helper/utils";
import {ICollateralProperty} from "../../collateral-property/collateral-property.model";

export enum HistoryAttributes {
  PREVIOUS_HISTORY = 'previousHistory',
  PREVIOUS_RETURN = 'previousReturn',
  DAR_REV_HISTORY = 'darRevHistory',
}

@Injectable({
  providedIn: 'root',
})
export class CompareDataService {
  constructor() {}

  public creditProposal$: BehaviorSubject<ICreditProposal> = new BehaviorSubject<ICreditProposal>(null);
  public creditProposal: Observable<ICreditProposal> = this.creditProposal$.asObservable();

  public collateralProperties$: BehaviorSubject<ICollateralProperty[]> = new BehaviorSubject<ICollateralProperty[]>(null);
  public collateralProperties: Observable<ICollateralProperty[]> = this.collateralProperties$.asObservable();

  public collateralPropertyGroupData$: BehaviorSubject<ICollateralProperty[]> = new BehaviorSubject<ICollateralProperty[]>(null);
  public collateralPropertyGroupData: Observable<ICollateralProperty[]> = this.collateralPropertyGroupData$.asObservable();

  public setCreditProposal(data: ICreditProposal): void {
    this.parseData(data);
  }

  public setCollateralProperties(data: ICollateralProperty[]): void {
    this.collateralProperties$.next(data);
  }

  public setCollateralPropertyGroupData(data: ICollateralProperty[]): void {
    this.collateralPropertyGroupData$.next(data);
  }

  public completeData(): void {
    this.collateralPropertyGroupData$.complete()
    this.collateralProperties$.complete()
    this.creditProposal$.complete()
  }

  parseData(data: ICreditProposal): void {
    const parsed: IParsePreviousAtrribute = parsePreviousAtrribute(data);
    this.creditProposal$.next(data);
  }

  getPreviousHistory() {
    return this.creditProposal$.value.attributes[HistoryAttributes.PREVIOUS_HISTORY];
  }

  getPreviousReturn() {
    return this.creditProposal$.value.attributes[HistoryAttributes.PREVIOUS_RETURN];
  }

  getDarRevHistory() {
    return this.creditProposal$.value.attributes[HistoryAttributes.DAR_REV_HISTORY];
  }
}
