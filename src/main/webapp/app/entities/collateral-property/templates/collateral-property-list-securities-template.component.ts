import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-securities-template',
  templateUrl: './collateral-property-list-securities-template.component.html',
})
export class CollateralPropertyListSecuritiesTemplateComponent {
  @Output() openDialogEvent = new EventEmitter<object>();

  private _dataSource: ICollateralProperty[];
  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }
  public displayColumns: string[] = [
    'no',
    'securitiesCustodian',
    'securitiesName',
    'securitiesUnitFaceAmount',
    'securitiesTotalFaceAmount',
    'marketValuePhysic',
    'marketValueIMB',
    'action',
  ];

  constructor() {}

  public openDialog(element: ICollateralProperty): void {
    this.openDialogEvent.emit(element);
  }
}
