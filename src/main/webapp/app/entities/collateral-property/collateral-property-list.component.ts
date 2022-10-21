import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { map } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import {
  CollateralProperty,
  CollateralPropertyDepositAttribute,
  CollateralPropertyOtherAttribute,
  CollateralPropertyRealEstateAttribute,
  CollateralPropertySecuritiesAttribute,
  ICollateralProperty,
} from './collateral-property.model';
import { CollateralPropertyService } from './collateral-property.service';
import { CollateralPropertyDepositDialogComponent } from './dialogs/collateral-property-deposit-dialog.component';
import { CollateralPropertySecuritiesDialogComponent } from './dialogs/collateral-property-securities-dialog.component';
import lodash from 'lodash';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralPropertyRealestateDialogComponent } from './dialogs/collateral-property-realestate-dialog.component';
import { CollateralPropertyOtherDialogComponent } from './dialogs/collateral-property-other-dialog.component';

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

  constructor(protected _snackbar: MatSnackBar, protected collateralPropertyService: CollateralPropertyService, private dialog: MatDialog) {
    super(_snackbar, collateralPropertyService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.loadData(this.collateral);
    }
  }

  public openDialog(element: ICollateralProperty = null): void {
    let value: ICollateralProperty = null;
    value = new CollateralProperty();
    value.partyId = this.collateral.partyId;
    value.collateralId = this.collateral.id;

    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      value.attributes = new CollateralPropertyDepositAttribute();
      if (element) {
        value = element;
      }

      const _dialog = this.dialog.open(CollateralPropertyDepositDialogComponent, {
        width: '80vw',
        data: { collateralProperty: value },
      });
      _dialog.afterClosed().subscribe(res => {
        if (res) {
          this.saveProperty(res);
        }
      });
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate']) {
      value.attributes = new CollateralPropertyRealEstateAttribute();
      value.propertyType = CollateralPropertyType.GENERAL;
      if (element) {
        value = element;
      }
      const _dialog = this.dialog.open(CollateralPropertyRealestateDialogComponent, {
        width: '80vw',
        data: { collateralProperty: value },
      });
      _dialog.afterClosed().subscribe(res => {
        if (res) {
          this.saveProperty(res);
        }
      });
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['other']) {
      value.attributes = new CollateralPropertyOtherAttribute();
      if (element) {
        value = element;
      }
      const _dialog = this.dialog.open(CollateralPropertyOtherDialogComponent, {
        width: '80vw',
        data: { collateralProperty: value },
      });
      _dialog.afterClosed().subscribe(res => {
        if (res) {
          this.saveProperty(res);
        }
      });
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['securities']) {
      value.attributes = new CollateralPropertySecuritiesAttribute();
      if (element) {
        value = element;
      }
      const _dialog = this.dialog.open(CollateralPropertySecuritiesDialogComponent, {
        width: '80vw',
        data: { collateralProperty: value },
      });
      _dialog.afterClosed().subscribe(res => {
        if (res) {
          this.saveProperty(res);
        }
      });
    }
  }

  private saveProperty(param: ICollateralProperty): void {
    if (!param.id) {
      this.collateralPropertyService.create(param).subscribe(res => {
        this.loadData(this.collateral);
      });
    } else {
      this.collateralPropertyService.update(param).subscribe(res => {
        this.loadData(this.collateral);
      });
    }
  }

  private postLoad(data: ICollateralProperty[]): void {
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate']) {
      this.dataSource = lodash.filter(data, function (o) {
        return o.propertyType === CollateralPropertyType.GENERAL;
      });
    } else {
      this.dataSource = data;
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
}
