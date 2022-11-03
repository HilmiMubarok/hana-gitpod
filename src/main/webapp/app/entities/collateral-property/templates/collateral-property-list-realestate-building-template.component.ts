import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CollateralBuildingDetailDialogComponent } from 'app/entities/collateral-appraisal/collateral/dialogs/collateral-building-detail-dialog.component';
import { CollateralBuildingFloorDialogComponent } from 'app/entities/collateral-appraisal/collateral/dialogs/collateral-building-floor-dialog.component';
import { CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { REALESTATE_CERTIFICATE_TYPE, REALESTATE_COLLATERAL_DETAIL_TYPE, UOM_TYPE } from 'app/shared/constants/base.constants';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { CollateralProperty, ICollateralProperty } from '../collateral-property.model';
import { CollateralPropertyService } from '../collateral-property.service';

@Component({
  selector: 'jhi-collateral-property-list-realestate-building-template',
  templateUrl: './collateral-property-list-realestate-building-template.component.html',
})
export class CollateralPropertyListRealestateBuildingTemplateComponent implements OnChanges {
  private _collateral: ICollateral;
  private _dataBuilding: ICollateralProperty;

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  @Input()
  get dataBuilding() {
    return this._dataBuilding;
  }
  set dataBuilding(param: ICollateralProperty) {
    this._dataBuilding = param;
  }

  @Input()
  public collateralAppraisalId: number;

  @Output() actionSelectionMenuProperty = new EventEmitter<string>();

  public totalLandArea: Number = 0;
  public displayedColumns: string[] = ['no', 'buildingSpec', 'floors', 'physicalArea', 'action'];

  public items: ICollateralProperty[] = new Array<ICollateralProperty>();
  public selectedMenuId = 'land-condition';
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

  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  constructor(public dialog: MatDialog, private collateralPropertyService: CollateralPropertyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral'] && changes['collateralAppraisalId']) {
      this.getData();
      this.setAttribute();
      this.actionSelectionMenuProperty.emit(this.selectedMenuId);
    }
  }

  private setAttribute(): void {
    if (this.selectedMenuId === 'building-condition') {
      if (!lodash.has(this.collateral.attributes, 'buildingFacElectricity')) {
        const attr: object = this.collateral.attributes;
        this.collateral.attributes = lodash.merge({}, attr, new CollateralAttribute());
      }
    }
  }

  private getData(): void {
    this.collateralPropertyService.queryFilterBy({ idCollateral: this.collateral.id, size: 9999 }).subscribe(res => {
      if (this.selectedMenuId === 'building-condition') {
        // building
        this.items = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.BUILDING;
        });
      }
    });
  }

  public openDialogBuilding(property: ICollateralProperty = null): void {
    const predicate = {
      width: '80vw',
    };

    // init variable collateralproperty
    if (property) {
      predicate['data'] = { collateralProperty: property };
    } else {
      const colProp: ICollateralProperty = new CollateralProperty();
      colProp.collateralId = this.collateral.id;
      colProp.propertyType = CollateralPropertyType.BUILDING;
      colProp.attributes = { floors: [] };
      predicate['data'] = { collateralProperty: colProp };
    }

    const dialogRef = this.dialog.open(CollateralBuildingDetailDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
    });
  }

  public openDialogFloor(data: ICollateralProperty): void {
    const dialogRef = this.dialog.open(CollateralBuildingFloorDialogComponent, {
      width: '80vw',
      data: { collateralProperty: data },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
      }
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

  public selectMenuItem(args: MenuEventArgs): void {
    this.items = new Array<ICollateralProperty>();
    this.selectedMenuId = args.item.id;
    this.getData();
    this.actionSelectionMenuProperty.emit(this.selectedMenuId);
  }

  public deleteBuilding(element) {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.getData();
    });
  }

  public deleteLand(element) {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.getData();
    });
  }

  public changeBuildingFacility(event: MatCheckboxChange, facilityType: string): void {
    const value: boolean = event.checked;
    if (facilityType === 'electricity') {
      this.collateral.attributes['buildingFacElectricity'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'telephone') {
      this.collateral.attributes['buildingFacTelephone'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'ac') {
      this.collateral.attributes['buildingFacAc'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'wh') {
      this.collateral.attributes['buildingFacWaterHeater'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'pam') {
      this.collateral.attributes['buildingFacCleanWater'] = value === true ? 'yes' : 'no';
    }

    console.log('xxx', this.collateral);
  }
}
