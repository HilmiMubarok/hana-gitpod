import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { map } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from './collateral-property.model';
import { CollateralPropertyService } from './collateral-property.service';
import lodash from 'lodash';

@Component({
  selector: 'jhi-collateral-property-list',
  templateUrl: './collateral-property-list.component.html',
})
export class CollateralPropertyListComponent extends AbstractEntityMaterialComponent<ICollateralProperty> implements OnChanges {
  @Input() public collateral: ICollateral;

  get dataSource() {
    return this.items;
  }
  set dataSource(param: any) {
    this.items = param;
  }

  public dataSourceLand: ICollateralProperty[] = [];
  public dataSourceBuilding: ICollateralProperty[] = [];

  public displayedColumns: string[] = [];
  public displayedColumnLand: string[] = [];
  public displayedColumnBuilding: string[] = [];
  constructor(protected _snackbar: MatSnackBar, protected collateralPropertyService: CollateralPropertyService) {
    super(_snackbar, collateralPropertyService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.setDisplayedColumns();
      this.loadData(this.collateral);
    }
  }

  private setDisplayedColumns(): void {
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['property']) {
      this.displayedColumns = ['no'];
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
      this.displayedColumns = [];
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
      this.displayedColumns = [];
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate']) {
      this.displayedColumnLand = ['no', 'certificateNumber', 'certificateName', 'issueDate', 'dueDate', 'gsNumber', 'area'];
      this.displayedColumnBuilding = ['no', 'specBuilding', 'floor', 'area'];
    }
  }

  private postLoad(data: ICollateralProperty[]): void {
    if (data.length > 0) {
      if (this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate']) {
        this.dataSourceBuilding = lodash.filter(data, function (o) {
          return o.propertyType === 'BUILDING';
        });
        this.dataSourceLand = lodash.filter(data, function (o) {
          return o.propertyType === 'LAND';
        });
      }
    }
  }

  private loadData(param: ICollateral): void {
    this.collateralPropertyService
      .queryFilterBy({
        idCollateral: param.id,
        page: this.page,
        size: 9999,
        sort: this.sortData(),
      })
      .pipe(map(res => this.preLoad(res)))
      .subscribe({
        next: res => this.postLoad(res.body),
        error: res => this.onError(res.message),
      });
  }

  protected postLoadDataLazy(): void {
    this.loadData(this.collateral);
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
