import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Input } from '@syncfusion/ej2-angular-inputs';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from './collateral-property.model';
import { CollateralPropertyService } from './collateral-property.service';
import lodash from 'lodash';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-collateral-property-market-value-dialog',
  templateUrl: './collateral-property-market-value-dialog.component.html',
  styleUrls: ['./collateral-property.style.scss'],
})
export class CollateralPropertyMarketValueDialogComponent extends AbstractEntityMaterialComponent<ICollateralProperty> implements OnInit {
  public collateral: ICollateral;
  public dataSourceLand: ICollateralProperty[] = [];
  public dataSourceBuilding: ICollateralProperty[] = [];
  public displayedColumnBuilding: string[] = [];
  public displayedColumnLand: string[] = [];
  public displayedColumns: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collateral: ICollateral },
    protected _snackbar: MatSnackBar,
    protected collateralPropertyService: CollateralPropertyService
  ) {
    super(_snackbar, collateralPropertyService);
    this.collateral = this.data.collateral;
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnInit(): void {
    this.loadAllByCollateral(this.collateral);
    this.loadAllDisplayedColumns(this.collateral);
  }

  private loadAllDisplayedColumns(param: ICollateral): void {
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['property']) {
      this.displayedColumns = ['no'];
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
      this.displayedColumns = [];
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
      this.displayedColumns = [];
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate']) {
      this.displayedColumnBuilding = [
        'no',
        'colObj',
        'area',
        'mv',
        'mvpermeter',
        'percentage',
        'liquid',
        'mvimb',
        'mvimbpermeter',
        'percentageimb',
        'liquidimb',
        'mvtk',
        'mvtkpermeter',
        'percentagetk',
        'liquidtk',
      ];
    }
  }

  private loadAllByCollateral(param: ICollateral): void {
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
}
