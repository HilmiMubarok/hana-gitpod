import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-real-estate',
  templateUrl: './collateral-appraisal-valuation-real-estate.component.html',
})
export class CollateralAppraisalValuationRealEstateComponent {
  public data: any = [];
  public dataDropdown: any = [];
  public fields: Object = {
    text: 'name',
    value: 'id',
  };
  public state = 'idle';
  public dialogVisible = false;
  public width = '90%';
  public height = '90%';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };
  public items = [
    {
      indexNum: 1,
    },
  ];

  public onEdit(data: any): void {
    this.state = 'idle';
    this.dialogVisible = true;
  }

  public onDelete(data: any): void {
    this.state = 'idle';
    this.dialogVisible = false;
  }

  public add(ev: any): void {
    this.dialogVisible = false;
    this.state = 'add';
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public addToGrid(ev: any): void {
    this.state = 'idle';
    this.dialogVisible = false;
  }
}
