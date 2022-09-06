import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralAppraisal } from './collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-info',
  templateUrl: './collateral-info.component.html',
  styleUrls: ['./collateral-info.css'],
})
export class CollateralInfoComponent {
  @Input()
  public collateral: ICollateral;
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
}
