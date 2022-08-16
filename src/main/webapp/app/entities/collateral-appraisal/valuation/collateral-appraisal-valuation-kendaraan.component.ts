import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-kendaraan',
  templateUrl: './collateral-appraisal-valuation-kendaraan.component.html',
  styleUrls: ['./collateral-appraisal-valuation.css'],
})
export class CollateralAppraisalValuationKendaraanComponent {
  // Initiation
  public items = [
    {
      indexNum: 1,
      collObj: 'Item 1',
      unit: 'Unit 1',
      marketValuePerUnit: '949',
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
  public unit?: string;
  public marketValuePerUnit?: string;
  public percentage?: string;

  public onEdit(data: any): void {
    this.collObj = data.collObj;
    this.unit = data.unit;
    this.marketValuePerUnit = data.marketValuePerUnit;
    this.percentage = data.percentage;

    this.dialogAddVisible = true;
    this.dialogEditVisible = true;
  }

  public onAdd(): void {
    this.clearTextBox();
    this.dialogAddVisible = true;
    this.dialogEditVisible = false;
  }

  public onDelete(data: any): void {
    this.dialogAddVisible = false;
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
        unit: this.unit,
        marketValuePerUnit: this.marketValuePerUnit,
        percentage: this.percentage,
      },
    ];

    this.clearTextBox();

    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public clearTextBox(): void {
    this.collObj = '';
    this.unit = '';
    this.marketValuePerUnit = '';
    this.percentage = '';
  }
}
