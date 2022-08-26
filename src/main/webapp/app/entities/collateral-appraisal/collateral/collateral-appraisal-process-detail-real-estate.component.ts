import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralBuildingDetailDialogComponent } from './dialogs/collateral-building-detail-dialog.component';
import lodash from 'lodash';
import { CollateralBuildingFloorDialogComponent } from './dialogs/collateral-building-floor-dialog.component';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-real-estate',
  templateUrl: './collateral-appraisal-process-detail-real-estate.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-real-estate.css'],
})
export class CollateralAppraisalDetailProcessRealEstateComponent implements OnChanges {
  @Input()
  public collateralId: number;

  public displayedColumns: string[] = ['no', 'buildingSpec', 'floors', 'physicalArea', 'action'];
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

  constructor(public dialog: MatDialog, private collateralPropertyService: CollateralPropertyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralId']) {
      this.getData();
    }
  }

  private getData(): void {
    this.collateralPropertyService.queryFilterBy({ idCollateral: this.collateralId, size: 9999 }).subscribe(res => {
      this.items = lodash.filter(res.body, function (o) {
        return o.propertyType === CollateralPropertyType.BUILDING;
      });
    });
  }

  public itemsBuilding = [
    {
      indexNum: 1,
      buildingSpecifications: 'abc',
      numberOfFloor: 'xyz',
      physicalArea: ' bca',
    },
  ];
  public dialogLandAddVisible = false;
  public dialogLandEditVisible = false;
  public dialogBuildingAddVisible = false;
  public dialogBuildingEditVisible = false;
  public width = '90%';
  public height = '90%';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Model
  public areaTruncated?: string;
  public totalArea?: string;
  public areaJalan?: string;
  public propertyUsage?: string;
  public landShaspe?: string;
  public landElevation?: string;
  public widthOfRoad?: string;
  public unitCondition?: string;
  public inhabitedBy?: string;
  public landPosition?: string;
  public facingPosition?: string;
  public madeWith?: string;
  public housingComplexVal?: string;
  public looseSettlementVal?: string;
  public officeComplexVal?: string;
  public commercialAreaVal?: string;
  public warehousingAreaVal?: string;
  public dataLeftSide = ['Left Side 1'];
  public valueLeftSide?: string;
  public dataRightSide = ['Right Side 1'];
  public valueRightSide?: string;
  public dataFrontSide = ['Front Side 1'];
  public valueFrontSide?: string;
  public dataBackSide = ['Back Side 1'];
  public valueBackSide?: string;

  public certificateNumber?: string;
  public inTheNameOf?: string;
  public noGs?: string;

  public buildingSpecifications?: string;
  public numberOfFloor?: string;
  public physicalArea?: string;

  public onAddLand(): void {
    this.clearTextBox();
    this.dialogLandAddVisible = true;
    this.dialogLandEditVisible = false;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = false;
  }

  public openDialog(property: ICollateralProperty = null): void {
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

    const _data = JSON.parse(data);
    if (_data.length > 0) {
      for (let i = 0; i < _data.length; i++) {
        console.log('xxx', _data[i]['area']);
        total = total + parseInt(_data[i]['area'], 10);
      }
    }
    return total;
  }

  public addToGridBuilding(): void {
    this.itemsBuilding = [
      ...this.itemsBuilding,
      {
        indexNum: this.itemsBuilding.length + 1,
        buildingSpecifications: this.buildingSpecifications,
        numberOfFloor: this.numberOfFloor,
        physicalArea: this.physicalArea,
      },
    ];

    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = false;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = false;
  }

  public onAddBuildingModal(ev: any): void {
    console.log('onAddBuildingModal');
  }

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;
  }

  public onDetailLandClick(data: any): void {
    this.certificateNumber = data.certificateNumber;
    this.inTheNameOf = data.inTheNameOf;
    this.noGs = data.noGs;

    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = true;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = false;
  }

  public onDetailBuildingClick(data: any): void {
    this.buildingSpecifications = data.buildingSpecifications;
    this.numberOfFloor = data.numberOfFloor;
    this.physicalArea = data.physicalArea;

    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = true;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = true;
  }

  public onOverlayLandAddClick(): void {
    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = false;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = false;
  }

  public onOverlayLandEditClick(): void {
    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = false;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = false;
  }

  public onOverlayBuildingAddClick(): void {
    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = false;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = false;
  }

  public onOverlayBuildingEditClick(): void {
    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = false;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = false;
  }

  public onDeleteLand(data: any): void {}

  public onDeleteBuilding(data: any): void {}

  public onDeleteBuildingModal(data: any): void {}

  public clearTextBox(): void {
    this.certificateNumber = '';
    this.inTheNameOf = '';
    this.noGs = '';
    this.buildingSpecifications = '';
    this.numberOfFloor = '';
    this.physicalArea = '';
  }
}
