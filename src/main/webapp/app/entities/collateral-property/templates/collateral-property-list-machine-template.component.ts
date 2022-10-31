import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-machine-template',
  templateUrl: './collateral-property-list-machine-template.component.html',
})
export class CollateralPropertyListMachineTemplateComponent {
  @Output() openDialogEvent = new EventEmitter<ICollateralProperty>();

  private _dataSource: ICollateralProperty[];
  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }
  public displayColumns: string[] = ['no', 'machineName', 'documentType', 'noDocument', 'date', 'from', 'amount', 'action'];

  constructor() {}

  public openDialog(element: ICollateralProperty): void {
    this.openDialogEvent.emit(element);
  }
}
