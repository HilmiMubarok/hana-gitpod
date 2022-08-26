import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICollateral } from '../collateral/collateral.model';

@Component({
  selector: 'jhi-collateral-info',
  templateUrl: './collateral-info.component.html',
})
export class CollateralInfoComponent {
  @Input()
  public collateral: ICollateral;

  constructor() {}
}
