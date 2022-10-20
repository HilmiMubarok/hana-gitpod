import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-deposit-template',
  templateUrl: './collateral-property-list-deposit-template.component.html',
})
export class CollateralPropertyListDepositTemplateComponent {
  @Output() openDialogEvent = new EventEmitter<object>();

  private _dataSource: ICollateralProperty[];
  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }
  public displayColumns: string[] = ['no', 'accountNumber', 'accountCustomer', 'accountOfficer', 'action'];

  constructor() {}

  public openDialog(element: ICollateralProperty, _subModel: string = null): void {
    this.openDialogEvent.emit({ collateralProperty: element, subModel: _subModel });
  }
}
