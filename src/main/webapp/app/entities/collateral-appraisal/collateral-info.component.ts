import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICollateral } from '../collateral/collateral.model';

@Component({
  selector: 'jhi-collateral-info',
  templateUrl: './collateral-info.component.html',
})
export class CollateralInfoComponent {
  @Input()
  public collateral: ICollateral;
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
