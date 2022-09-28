import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralBuildingDetailDialogComponent } from './dialogs/collateral-building-detail-dialog.component';
import lodash from 'lodash';
import { CollateralBuildingFloorDialogComponent } from './dialogs/collateral-building-floor-dialog.component';
import { CollateralLandDialogComponent } from './dialogs/collateral-land-dialog.component';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { Collateral, ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-real-estate',
  templateUrl: './collateral-appraisal-process-detail-real-estate.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-real-estate.css'],
})
export class CollateralAppraisalDetailProcessRealEstateComponent implements OnChanges {
  @Input()
  public collateralId: number;

  @Input()
  public collateralAppraisalId: number;

  @Output() actionSelectionMenuProperty = new EventEmitter<string>();

  public totalLandArea: Number = 0;
  public collateral: ICollateral;
  public displayedColumns: string[] = ['no', 'buildingSpec', 'floors', 'physicalArea', 'action'];
  public displayedColumnsLand: string[] = [
    'no',
    'certificateNo',
    'certificateName',
    'issueDate',
    'dueDate',
    'suratUkurNum',
    'area',
    'action',
  ];

  public items: ICollateralProperty[] = new Array<ICollateralProperty>();
  public selectedMenuId = 'building-condition';
  public menuItems: MenuItemModel[] = [
    {
      id: 'land-condition',
      text: 'Land Condition',
    },
    {
      id: 'building-condition',
      text: 'Building Condition',
    },
  ];

  public totalCountAreaLand: number;
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  constructor(
    public dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    private collateralService: CollateralService
  ) {
    this.collateral = new Collateral();
    this.totalCountAreaLand = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralId'] && changes['collateralAppraisalId']) {
      this.getData();
      this.getCollateral();
      this.actionSelectionMenuProperty.emit(this.selectedMenuId);
    }
  }

  private getCollateral(): void {
    this.collateralService.find(this.collateralId).subscribe(res => {
      this.collateral = res.body;
    });
  }

  public countTotalLandArea(val1: number | 0, val2: number | 0): number {
    return val2 - val1;
  }

  private getData(): void {
    this.collateralPropertyService.queryFilterBy({ idCollateral: this.collateralId, size: 9999 }).subscribe(res => {
      if (this.selectedMenuId === 'building-condition') {
        // building
        this.items = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.BUILDING;
        });
      } else {
        // land
        this.items = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.LAND;
        });
        this.totalCountAreaLand = 0;
        if (this.items.length > 0) {
          for (let i = 0; i < this.items.length; i++) {
            this.totalCountAreaLand = this.totalCountAreaLand + this.items[i].landSizePerCertificate;
          }
        }
      }
    });
  }

  public openDialogLand(property: ICollateralProperty = null): void {
    const predicate = {
      width: '80vw',
    };

    // init variable collateralproperty
    if (property) {
      predicate['data'] = { collateralProperty: property };
    } else {
      const colProp: ICollateralProperty = new CollateralProperty();
      colProp.collateralId = this.collateralId;
      colProp.propertyType = CollateralPropertyType.LAND;
      predicate['data'] = { collateralProperty: colProp };
    }

    const dialogRef = this.dialog.open(CollateralLandDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getData();
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
      colProp.collateralId = this.collateralId;
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
      this.getCollateral();
    });
  }

  public deleteLand(element) {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.getData();
      this.getCollateral();
    });
  }
}
