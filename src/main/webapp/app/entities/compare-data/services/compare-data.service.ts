import { Injectable } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { IParsePreviousAtrribute, parsePreviousAtrribute } from '../../../shared/helper/utils';
import { ICollateralProperty } from '../../collateral-property/collateral-property.model';

export enum HistoryAttributes {
  PREVIOUS_HISTORY = 'previousHistory',
  PREVIOUS_RETURN = 'previousReturn',
  PREVIOUS_OL = 'previousOfferingLetter',
  DAR_REV_HISTORY = 'darRevHistory',
}

@Injectable({
  providedIn: 'root',
})
export class CompareDataService {
  private creditProposal$: BehaviorSubject<ICreditProposal> = new BehaviorSubject<ICreditProposal>(null);
  public creditProposal: Observable<ICreditProposal> = this.creditProposal$.asObservable();

  private creditProposalPreviousDar$: BehaviorSubject<ICreditProposal> = new BehaviorSubject<ICreditProposal>(null);
  public creditProposalPreviousDar: Observable<ICreditProposal> = this.creditProposalPreviousDar$.asObservable();

  private collateralProperties$: BehaviorSubject<ICollateralProperty[]> = new BehaviorSubject<ICollateralProperty[]>(null);
  public collateralProperties: Observable<ICollateralProperty[]> = this.collateralProperties$.asObservable();

  private collateralPropertyGroupData$: BehaviorSubject<ICollateralProperty[]> = new BehaviorSubject<ICollateralProperty[]>(null);
  public collateralPropertyGroupData: Observable<ICollateralProperty[]> = this.collateralPropertyGroupData$.asObservable();

  public setCreditProposal(data: ICreditProposal): void {
    this.#parseData(data);
  }

  public setCollateralProperties(data: ICollateralProperty[]): void {
    this.collateralProperties$.next(data);
  }

  public setCollateralPropertyGroupData(data: ICollateralProperty[]): void {
    this.collateralPropertyGroupData$.next(data);
  }

  public setCreditProposalPreviousDar(data: ICreditProposal): void {
    /**
     * Ga perlu parse, karena yang diambil yaitu data dr entitinya, bukan attribute.
     */
    this.creditProposalPreviousDar$.next(data);
  }

  #parseData(data: ICreditProposal): void {
    const parsed: ICreditProposal = this.#convertParsedDataToCreditProposal(parsePreviousAtrribute(data), data);
    this.creditProposal$.next(parsed);
  }

  /**
   * Convert parsed data to credit proposal.
   *
   * Check if previousHistory | previousReturn | darRevHistory attribute is exist from cp
   * if existed, then check if it is string or not, if string then replace it with parsed data
   * if not string, then just return the cp
   * if not exist, then just return the cp
   *
   * @param {IParsePreviousAtrribute} parsed - The parsed data.
   * @param {ICreditProposal} cp - The credit proposal.
   * @return {ICreditProposal} The modified credit proposal.
   */
  #convertParsedDataToCreditProposal(parsed: IParsePreviousAtrribute, cp: ICreditProposal): ICreditProposal {
    const attributes = cp.attributes;

    if (typeof attributes[HistoryAttributes.PREVIOUS_HISTORY] === 'string') {
      attributes[HistoryAttributes.PREVIOUS_HISTORY] = parsed.previousHistory;
    }

    if (typeof attributes[HistoryAttributes.PREVIOUS_RETURN] === 'string') {
      attributes[HistoryAttributes.PREVIOUS_RETURN] = parsed.previousReturn;
    }

    if (typeof attributes[HistoryAttributes.PREVIOUS_OL] === 'string') {
      attributes[HistoryAttributes.PREVIOUS_OL] = parsed.previousOfferingLetter;
    }

    if (typeof attributes[HistoryAttributes.DAR_REV_HISTORY] === 'string') {
      attributes[HistoryAttributes.DAR_REV_HISTORY] = parsed.darRevHistory;
    }

    return cp;
  }
}
