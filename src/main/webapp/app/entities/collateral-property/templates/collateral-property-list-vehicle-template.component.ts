import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-vehicle-template',
  templateUrl: './collateral-property-list-vehicle-template.component.html',
})
export class CollateralPropertyListVehicleTemplateComponent implements OnChanges {
  private _dataSource: ICollateralProperty[];

  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }
  public displayColumns: string[] = ['no', 'bpkbNum', 'ownerName', 'vehicleNum', 'stnkNum', 'chasisNum', 'machineNum', 'invNum', 'year'];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      console.log('hello world');
    }
  }
}
