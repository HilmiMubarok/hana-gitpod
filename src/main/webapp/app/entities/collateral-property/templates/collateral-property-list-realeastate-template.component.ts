import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from '../collateral-property.model';
import lodash from 'lodash';

@Component({
  selector: 'jhi-collateral-property-list-realestate-template',
  templateUrl: './collateral-property-list-realeastate-template.component.html',
})
export class CollateralPropertyListRealestateTemplateComponent implements OnChanges {
  private _dataSource: ICollateralProperty[];

  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }

  public displayedColumnBuilding: string[] = [];
  public displayedColumnLand: string[] = [];
  public dataSourceLand: ICollateralProperty[] = [];
  public dataSourceBuilding: ICollateralProperty[] = [];
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.displayedColumnLand = ['no', 'certificateNumber', 'certificateName', 'issueDate', 'dueDate', 'gsNumber', 'area'];
      this.displayedColumnBuilding = ['no', 'specBuilding', 'floor', 'area'];
      this.splitData();
    }
  }

  private splitData(): void {
    this.dataSourceBuilding = lodash.filter(this.dataSource, function (o) {
      return o.propertyType === 'BUILDING';
    });
    this.dataSourceLand = lodash.filter(this.dataSource, function (o) {
      return o.propertyType === 'LAND';
    });
  }

  public countTotalArea(data: string): Number {
    let total: number;
    total = 0;

    if (data) {
      const _data = JSON.parse(data);
      if (_data.length > 0) {
        for (let i = 0; i < _data.length; i++) {
          total = total + parseInt(_data[i]['area'], 10);
        }
      }
    }

    return total;
  }
}
