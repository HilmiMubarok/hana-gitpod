import { Injectable } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICreditProposal } from '../../credit-proposal.model';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Injectable({
  providedIn: 'root',
})
export class MemoBandingCollateralService {
  collateralProperties$: BehaviorSubject<ICollateralProperty[]> = new BehaviorSubject<ICollateralProperty[]>([]);
  collateralProperties: Observable<ICollateralProperty[]> = this.collateralProperties$.asObservable();

  collaterals$: BehaviorSubject<ICollateral[]> = new BehaviorSubject<ICollateral[]>([]);
  collaterals: Observable<ICollateral[]> = this.collaterals$.asObservable();

  setCollateralProperties(collateralProperties: ICollateralProperty[]) {
    this.collateralProperties$.next(collateralProperties);
  }

  getParsedCollateral(creditProposal: ICreditProposal): void {
    this.collaterals$.next(parsePreviousAtrribute(creditProposal).previousOfferingLetter.collaterals);
  }
}
