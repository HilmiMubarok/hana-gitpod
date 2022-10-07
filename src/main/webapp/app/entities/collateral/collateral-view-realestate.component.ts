import { Component, Input } from '@angular/core';
import { ICollateral } from './collateral.model';

@Component({
  selector: 'jhi-collateral-view-realestate',
  templateUrl: './collateral-view-realestate.component.html',
})
export class CollateralViewRealEstateComponent {
  private _collateral: ICollateral;

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  constructor() {}
}
