import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OTHER_COLLATERAL_DETAIL_TYPE } from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-other-template',
  templateUrl: './collateral-property-list-other-template.component.html',
})
export class CollateralPropertyListOthersTemplateComponent {
  @Output() openDialogEvent = new EventEmitter<ICollateralProperty>();

  private _dataSource: ICollateralProperty[];
  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }

  public collateralDetailType: any;
  public displayColumns: string[] = [
    'no',
    'detailType',
    'refNumber',
    'qtySize',
    'marketValue',
    'marketValueIMB',
    'address',
    'accountOfficer',
    'action',
  ];

  constructor() {
    this.collateralDetailType = OTHER_COLLATERAL_DETAIL_TYPE;
  }

  public openDialog(element: ICollateralProperty): void {
    this.openDialogEvent.emit(element);
  }
}
