import { Component } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-real-estate',
  templateUrl: './collateral-appraisal-process-detail-real-estate.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalDetailProcessRealEstateComponent {
  public state = 'idle';
  public selectedMenuId = 'land-condition';
  public items = [
    {
      indexNum: 1,
      cNum: 'C001',
      inName: 'Budiono',
      dateOfIsue: Date.now(),
      dueDate: Date.now(),
      gsNo: 'G001',
      area: 'Jakarta',
    },
  ];
  public dialogLandVisible = false;
  public dialogBuildingVisible = false;
  public width = '90%';
  public height = '90%';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

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

  public addLand(ev: any): void {
    this.dialogLandVisible = false;
    this.dialogBuildingVisible = false;
    this.state = 'addLand';
  }

  public addBuilding(ev: any): void {
    this.dialogLandVisible = false;
    this.dialogBuildingVisible = false;
    this.state = 'addBuilding';
  }

  public addToGridLand(ev: any): void {
    this.state = 'idle';
    this.dialogLandVisible = false;
    this.dialogBuildingVisible = false;
    this.items.push({
      indexNum: 2,
      cNum: 'C002',
      inName: 'Budiono',
      dateOfIsue: Date.now(),
      dueDate: Date.now(),
      gsNo: 'G002',
      area: 'Jakarta',
    });
  }

  public addToGridBuilding(ev: any): void {
    this.state = 'idle';
    this.dialogBuildingVisible = false;
    this.dialogLandVisible = false;
  }

  public onAddBuildingModal(ev: any): void {
    console.log('onAddBuildingModal');
  }

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;
  }

  public onDetailLandClick(): void {
    this.state = 'idle';
    this.dialogLandVisible = true;
    this.dialogBuildingVisible = false;
  }

  public onDetailBuildingClick(): void {
    this.state = 'idle';
    this.dialogBuildingVisible = true;
    this.dialogLandVisible = false;
  }

  public onOverlayLandClick(): void {
    this.dialogLandVisible = false;
    this.dialogBuildingVisible = false;
    this.state = 'idle';
  }

  public onOverlayBuildingClick(): void {
    this.dialogBuildingVisible = false;
    this.dialogLandVisible = false;
    this.state = 'idle';
  }

  public onDeleteLand(data: any): void {}

  public onDeleteBuilding(data: any): void {}

  public onDeleteBuildingModal(data: any): void {}
}
