import { Component } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-real-estate',
  templateUrl: './collateral-appraisal-process-detail-real-estate.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-real-estate.css'],
})
export class CollateralAppraisalDetailProcessRealEstateComponent {
  // Initiation
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
  public selectedMenuId = 'land-condition';
  public items = [
    {
      indexNum: 1,
      certificateNumber: 'abc',
      inTheNameOf: 'xyz',
      noGs: ' bca',
    },
  ];
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

  public onAddBuilding(): void {
    this.clearTextBox();
    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = false;
    this.dialogBuildingAddVisible = true;
    this.dialogBuildingEditVisible = false;
  }

  public addToGridLand(): void {
    this.items = [
      ...this.items,
      {
        indexNum: this.items.length + 1,
        certificateNumber: this.certificateNumber,
        inTheNameOf: this.inTheNameOf,
        noGs: this.noGs,
      },
    ];

    this.dialogLandAddVisible = false;
    this.dialogLandEditVisible = false;
    this.dialogBuildingAddVisible = false;
    this.dialogBuildingEditVisible = false;
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
