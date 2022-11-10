import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { map } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import { CollateralProperty, CollateralPropertyAttribute, ICollateralProperty } from './collateral-property.model';
import { CollateralPropertyService } from './collateral-property.service';
import { CollateralPropertyDepositDialogComponent } from './dialogs/collateral-property-deposit-dialog.component';
import { CollateralPropertySecuritiesDialogComponent } from './dialogs/collateral-property-securities-dialog.component';
import lodash from 'lodash';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralPropertyRealestateDialogComponent } from './dialogs/collateral-property-realestate-dialog.component';
import { CollateralPropertyOtherDialogComponent } from './dialogs/collateral-property-other-dialog.component';
import { CollateralPropertyMachineDialogComponent } from './dialogs/collateral-property-machine-dialog.component';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CollateralPropertyVehicleDialogComponent } from './dialogs/collateral-property-vehicle-dialog.component';
import { CollateralPropertyBuildingDialogComponent } from './dialogs/collateral-property-building-dialog.component';
import { CollateralPropertyLandInfoDialogComponent } from './dialogs/collateral-property-land-info-dialog.component';

@Component({
  selector: 'jhi-collateral-property-list',
  templateUrl: './collateral-property-list.component.html',
})
export class CollateralPropertyListComponent extends AbstractEntityMaterialComponent<ICollateralProperty> implements OnChanges {
  public menu: any;
  public dataBuilding: any;
  public dataLand: any;
  public allProp: any;

  @Input() public collateral: ICollateral;

  get dataSource() {
    return this.items;
  }
  set dataSource(param: any) {
    this.items = param;
  }

  public menuItems: MenuItemModel[] = [
    {
      id: 'certificate-info',
      text: 'Certificate Info',
    },
    {
      id: 'land-condition',
      text: 'Land Condition',
    },
    {
      id: 'building-condition',
      text: 'Building Condition',
    },
  ];

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
      this.postLoad(this.items);
    }
  }

  public openDialog(element: ICollateralProperty = null): void {
    let value: ICollateralProperty = null;
    value = new CollateralProperty();
    value.partyId = this.collateral.partyId;
    value.collateralId = this.collateral.id;

    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
      value.propertyType = CollateralPropertyType.MACHINE;
      if (element) {
        value = element;
      }
      const _dialog = this.dialog.open(CollateralPropertyMachineDialogComponent, {
        width: '80vw',
        data: {
          collateralProperty: value,
        },
      });
      _dialog.afterClosed().subscribe(res => {
        if (res) {
          this.saveProperty(res);
        }
      });
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['other']) {
      value.attributes = new CollateralPropertyAttribute();
      if (element) {
        value = element;
      }
      const _dialog = this.dialog.open(CollateralPropertyOtherDialogComponent, {
        width: '80vw',
        data: {
          collateralProperty: value,
        },
      });
      _dialog.afterClosed().subscribe(res => {
        if (res) {
          this.saveProperty(res);
        }
      });
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['securities']) {
      value.attributes = new CollateralPropertyAttribute();
      if (element) {
        value = element;
      }
      const _dialog = this.dialog.open(CollateralPropertySecuritiesDialogComponent, {
        width: '80vw',
        data: {
          collateralProperty: value,
        },
      });
      _dialog.afterClosed().subscribe(res => {
        if (res) {
          this.saveProperty(res);
        }
      });
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
      console.log('dialod dibuka dari list');
      value.propertyType = CollateralPropertyType.VEHICLE;
      if (element) {
        value = element;
      }
      const _dialog = this.dialog.open(CollateralPropertyVehicleDialogComponent, {
        width: '80vw',
        data: {
          collateralProperty: value,
        },
      });
      _dialog.afterClosed().subscribe(res => {
        if (res) {
          this.saveProperty(res);
        }
        this.postLoad(this.items);
      });
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] && this.menu === 'land-condition') {
      value.propertyType = CollateralPropertyType.LAND;
      if (element) {
        value = element;
      }
      const _dialog = this.dialog.open(CollateralPropertyLandInfoDialogComponent, {
        width: '80vw',
        data: {
          collateralProperty: value,
        },
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
        console.log('save baru');
      });
    } else {
      this.collateralPropertyService.update(param).subscribe(res => {
        this.loadData(this.collateral);
        console.log('update');
      });
    }
  }

  private postLoad(data: ICollateralProperty[]): void {
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate']) {
      this.dataSource = lodash.filter(data, function (o) {
        return o.propertyType === CollateralPropertyType.GENERAL;
      });
      this.dataBuilding = lodash.filter(data, function (o) {
        return o.propertyType === CollateralPropertyType.BUILDING;
      });
      this.dataLand = lodash.filter(data, function (o) {
        return o.propertyType === CollateralPropertyType.LAND;
      });
      this.allProp = data;
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
      this.dataSource = lodash.filter(data, function (o) {
        return o.propertyType === CollateralPropertyType.VEHICLE;
      });
    } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
      this.dataSource = lodash.filter(data, function (o) {
        return o.propertyType === CollateralPropertyType.MACHINE;
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

  public selectMenuItem(event) {
    this.menu = event.item.properties.id;
    console.log(event.item.properties.id);
  }

  public print() {
    console.log('ini collateral', this.collateral);
    console.log('data source', this.dataSource);
  }
}
