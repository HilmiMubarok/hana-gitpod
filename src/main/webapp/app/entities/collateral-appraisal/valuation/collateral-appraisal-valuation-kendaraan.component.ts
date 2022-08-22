import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CollateralAppraisalService } from '../collateral-appraisal.service';
import { ICollateralProperty, CollateralProperty } from '../../collateral-property/collateral-property.model';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-kendaraan',
  templateUrl: './collateral-appraisal-valuation-kendaraan.component.html',
  styleUrls: ['./collateral-appraisal-valuation.css'],
})
export class CollateralAppraisalValuationKendaraanComponent {
  // Initiation
  public items?: ICollateralProperty[];
  public itemsMod?: any;
  public isAdd?: boolean;
  public dialogVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  constructor(private collateralAppraisalService: CollateralAppraisalService) {
    this.collateralAppraisalService.collateralPropertyChange.subscribe(collateralPropertyMod => {
      // this.items = collateralProperty;
      this.itemsMod = collateralPropertyMod;
    });
  }

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

    this.isAdd = false;
    this.dialogVisible = true;
  }

  public onAdd(): void {
    this.clearTextBox();
    this.isAdd = true;
    this.dialogVisible = true;
  }

  public onDelete(data: any): void {
    this.dialogVisible = false;
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public addToGrid(): void {
    this.itemsMod = [
      ...this.itemsMod,
      {
        indexNum: this.itemsMod.length + 1,
        collObj: this.collObj,
        unit: this.unit,
        marketValuePerUnit: this.marketValuePerUnit,
        percentage: this.percentage,
      },
    ];

    this.clearTextBox();

    this.dialogVisible = false;
  }

  public clearTextBox(): void {
    this.collObj = '';
    this.unit = '';
    this.marketValuePerUnit = '';
    this.percentage = '';
  }
}
