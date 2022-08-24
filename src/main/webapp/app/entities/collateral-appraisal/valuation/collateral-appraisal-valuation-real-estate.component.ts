import { Component, ViewChild } from '@angular/core';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-real-estate',
  templateUrl: './collateral-appraisal-valuation-real-estate.component.html',
  styleUrls: ['./collateral-appraisal-valuation.css'],
})
export class CollateralAppraisalValuationRealEstateComponent {
  @ViewChild('ddcollateral')
  public dropDownListObject: DropDownListComponent;
  public fields: Object = {
    text: 'name',
    value: 'id',
  };
  public dataDropdown: any = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  public items = [
    {
      indexNum: 1,
      collObj: 'Item 1',
      areaM2: '240',
      marketValM2: 'Market Value M2',
      marketValMv: 'Market Valur MV',
      percentageVal: '68',
      ttlLandLiqValIndication: '100',
    },
  ];
  public dialogEditVisible = false;
  public dialogAddVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Model
  public collObj?: string;
  public areaM2?: string;
  public marketValM2?: string;
  public marketValMv?: string;
  public percentageVal?: string;
  public ttlLandLiqValIndication?: string;

  public onEdit(data: any): void {
    this.collObj = data.collObj;
    this.areaM2 = data.areaM2;
    this.marketValM2 = data.marketValM2;
    this.marketValMv = data.marketValMv;
    this.percentageVal = data.percentageVal;
    this.ttlLandLiqValIndication = data.ttlLandLiqValIndication;
    this.dialogAddVisible = false;
    this.dialogEditVisible = true;
  }

  public onDelete(data: any): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public onAdd(): void {
    this.clearTextBox();
    this.dialogEditVisible = false;
    this.dialogAddVisible = true;
  }

  public onOverlayAddClick(): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public onOverlayEditClick(): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public addToGrid(): void {
    this.items = [
      ...this.items,
      {
        indexNum: this.items.length + 1,
        collObj: this.collObj,
        areaM2: this.areaM2,
        marketValM2: this.marketValM2,
        marketValMv: this.marketValMv,
        percentageVal: this.percentageVal,
        ttlLandLiqValIndication: this.ttlLandLiqValIndication,
      },
    ];

    this.clearTextBox();

    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public clearTextBox(): void {
    this.dropDownListObject.value = null;
    this.areaM2 = '';
    this.marketValM2 = '';
    this.marketValMv = '';
    this.percentageVal = '';
    this.ttlLandLiqValIndication = '';
  }
}
