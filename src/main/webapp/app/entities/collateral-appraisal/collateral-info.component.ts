import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralAppraisal } from './collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-info',
  templateUrl: './collateral-info.component.html',
  styleUrls: ['./collateral-info.css'],
})
export class CollateralInfoComponent {
  private _collateral: ICollateral;
  public disabledOpt = true;
  public hiddenOpt = false;

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  @Input()
  public appraisal: ICollateralAppraisal;

  @Input()
  public mode: string;
  public propertySelectionMenu: string;

  constructor() {
    this.propertySelectionMenu = '';
  }

  public onSelectionMenuProperty(data: string): void {
    this.propertySelectionMenu = '';
    if (data.includes('land')) {
      this.propertySelectionMenu = 'land';
    }
  }

  public print() {
    console.log(this.appraisal.collateral.collateralTypeId);
  }
}
