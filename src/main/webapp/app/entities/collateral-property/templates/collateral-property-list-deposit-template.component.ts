import { Component, Input } from '@angular/core';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-deposit-template',
  templateUrl: './collateral-property-list-deposit-template.component.html',
})
export class CollateralPropertyListDepositTemplateComponent {
  private _dataSource: ICollateralProperty[];

  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }
  public displayColumns: string[] = ['no'];

  constructor() {}
}
