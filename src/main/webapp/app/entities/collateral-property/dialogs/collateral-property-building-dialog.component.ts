import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SurveyAppraisalsService } from 'app/entities/survey-appraisals/survey-appraisals.service';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-building-dialog',
  templateUrl: './collateral-property-building-dialog.component.html',
})
export class CollateralPropertyBuildingDialogComponent implements OnInit {
  public collateralProperty: ICollateralProperty;
  public constructionData: object[];
  public foundationData: object[];
  public wallData: object[];
  public flooringData: object[];
  public ceilingData: object[];
  public roofTrussData: object[];
  public roofData: object[];
  constructor(
    private surveyAppraisalsService: SurveyAppraisalsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyBuildingDialogComponent>
  ) {
    this.collateralProperty = this.data.collateralProperty;
  }
  ngOnInit(): void {
    this.getConstruction();
    this.getFoundation();
    this.getWall();
    this.getFlooring();
    this.getCeiling();
    this.getRoofTruss();
    this.getRoof();
  }

  public numberInputChanged(value: any): number {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }

  private getConstruction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/construction').subscribe(res => {
        this.constructionData = res.body;
        resolve();
      });
    });
  }

  private getFoundation(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/foundation').subscribe(res => {
        this.foundationData = res.body;
        resolve();
      });
    });
  }

  private getWall(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/wall').subscribe(res => {
        this.wallData = res.body;
        resolve();
      });
    });
  }

  private getFlooring(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/floor').subscribe(res => {
        this.flooringData = res.body;
        resolve();
      });
    });
  }

  private getCeiling(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/ceiling').subscribe(res => {
        this.ceilingData = res.body;
        resolve();
      });
    });
  }

  private getRoofTruss(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/roof-truss').subscribe(res => {
        this.roofTrussData = res.body;
        resolve();
      });
    });
  }

  private getRoof(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/roof').subscribe(res => {
        this.roofData = res.body;
        resolve();
      });
    });
  }
}
