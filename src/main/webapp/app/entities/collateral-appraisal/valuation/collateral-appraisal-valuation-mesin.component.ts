import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-mesin',
  templateUrl: './collateral-appraisal-valuation-mesin.component.html',
  styleUrls: ['./collateral-appraisal-valuation.css'],
})
export class CollateralAppraisalValuationMesinComponent {
  // Initiation
  public items = [
    {
      indexNum: 1,
      collObj: 'Item 1',
      brand: 'Brand',
      madeBy: 'Indonesia',
      mfgDate: '05/08/2020',
      marketValue: '949',
      percentage: '90',
    },
  ];
  public dialogAddVisible = false;
  public dialogEditVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Model
  public collObj?: string;
  public brand?: string;
  public madeBy?: string;
  public mfgDate?: string;
  public marketValue?: string;
  public percentage?: string;

  public onEdit(data: any): void {
    this.collObj = data.collObj;
    this.brand = data.brand;
    this.madeBy = data.madeBy;
    this.mfgDate = data.mfgDate;
    this.marketValue = data.marketValue;
    this.percentage = data.percentage;

    this.dialogAddVisible = false;
    this.dialogEditVisible = true;
  }

  public onDelete(data: any): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public onAdd(): void {
    this.clearTextBox();
    this.dialogAddVisible = true;
    this.dialogEditVisible = false;
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
        brand: this.brand,
        madeBy: this.madeBy,
        mfgDate: this.mfgDate,
        marketValue: this.marketValue,
        percentage: this.percentage,
      },
    ];

    this.clearTextBox();

    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public clearTextBox(): void {
    this.collObj = '';
    this.brand = '';
    this.madeBy = '';
    this.mfgDate = '';
    this.marketValue = '';
    this.percentage = '';
  }
}
