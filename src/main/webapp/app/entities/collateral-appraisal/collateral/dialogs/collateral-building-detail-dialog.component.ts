import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { SurveyAppraisalsService } from '../../../survey-appraisals/survey-appraisals.service';

@Component({
  selector: 'jhi-collateral-building-detail-dialog',
  templateUrl: './collateral-building-detail-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralBuildingDetailDialogComponent {
  public collateralProp: ICollateralProperty;
  public constructionData: any[];
  public foundationData: any[];
  public wallData: any[];
  public flooringData: any[];
  public ceilingData: any[];
  public roofTrussData: any[];
  public roofData: any[];
  /* public constructionData: Observable<any>;
  public foundationData: Observable<any>;
  public wallData: Observable<any>;
  public flooringData: Observable<any>;
  public ceilingData: Observable<any>;
  public roofTrussData: Observable<any>;
  public roofData: Observable<any>;
  public fields: Object = { text: 'label', value: 'id' }; */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty },
    private _dialog: MatDialogRef<CollateralBuildingDetailDialogComponent>,
    private collateralPropertyService: CollateralPropertyService,
    private surveyAppraisalsService: SurveyAppraisalsService
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.disableButton();
    this.getLov();
  }

  private getLov(): void {
    this.getConstruction();
    this.getFoundation();
    this.getWall();
    this.getFlooring();
    this.getCeiling();
    this.getRoofTruss();
    this.getRoof();
  }

  private getConstruction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/construction').subscribe((res: HttpResponse<any>) => {
        /* let passConstructionData: { [key: string]: Object }[] = [];
		passConstructionData = res.body;
		this.constructionData = of(passConstructionData); */
        this.constructionData = res.body;
        resolve();
      });
    });
  }

  private getFoundation(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/foundation').subscribe((res: HttpResponse<any>) => {
        /* let passFoundationData: { [key: string]: Object }[] = [];
		passFoundationData = res.body;
		this.foundationData = of(passConstructionData); */
        this.foundationData = res.body;
        resolve();
      });
    });
  }

  private getWall(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/wall').subscribe((res: HttpResponse<any>) => {
        /* const passWallData: { [key: string]: Object }[] = [];
		passWallData = res.body;
		this.wallData = of(passWallData); */
        this.wallData = res.body;
        resolve();
      });
    });
  }

  private getFlooring(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/floor').subscribe((res: HttpResponse<any>) => {
        /* const passFlooringData: { [key: string]: Object }[] = [];
		passFlooringData = res.body;
		this.flooringData = of(passFlooringData); */
        this.flooringData = res.body;
        resolve();
      });
    });
  }

  private getCeiling(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/ceiling').subscribe((res: HttpResponse<any>) => {
        /* const passCeilingData: { [key: string]: Object }[] = [];
		passCeilingData = res.body;
		this.ceilingData = of(passCeilingData); */
        this.ceilingData = res.body;
        resolve();
      });
    });
  }

  private getRoofTruss(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/roof-truss').subscribe((res: HttpResponse<any>) => {
        /* const passRoofTrussData: { [key: string]: Object }[] = [];
		passRoofTrussData = res.body;
		this.roofTrussData = of(passRoofTrussData); */
        this.roofTrussData = res.body;
        resolve();
      });
    });
  }

  private getRoof(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.customGet('lov/roof').subscribe((res: HttpResponse<any>) => {
        /* const passRoofData: { [key: string]: Object }[] = [];
		passRoofData = res.body;
		this.roofData = of(passRoofData); */
        this.roofData = res.body;
        resolve();
      });
    });
  }

  public onSelectConstruction(args: any): void {
    console.log('args @onSelectConstruction : ', args);
  }

  public onSelectFoundation(args: any): void {
    console.log('args @onSelectFoundation : ', args);
  }

  public onSelectWall(args: any): void {
    console.log('args @onSelectWall : ', args);
  }

  public onSelectFlooring(args: any): void {
    console.log('args @onSelectFlooring : ', args);
  }

  public onSelectCeiling(args: any): void {
    console.log('args @onSelectCeiling : ', args);
  }

  public onSelectRoofTruss(args: any): void {
    console.log('args @onSelectRoofTruss : ', args);
  }

  public onSelectRoof(args: any): void {
    console.log('args @onSelectRoof : ', args);
  }
  public disableButton() {
    let kosong: boolean;
    kosong = true;
    if (
      this.collateralProp.buildingSpec !== '' &&
      this.collateralProp.construction !== '' &&
      this.collateralProp.foundation !== '' &&
      this.collateralProp.wall !== '' &&
      this.collateralProp.flooring !== '' &&
      this.collateralProp.ceiling !== '' &&
      this.collateralProp.roofTruss !== '' &&
      this.collateralProp.roof !== '' &&
      this.collateralProp.buildingSpec !== undefined &&
      this.collateralProp.construction !== undefined &&
      this.collateralProp.foundation !== undefined &&
      this.collateralProp.wall !== undefined &&
      this.collateralProp.flooring !== undefined &&
      this.collateralProp.ceiling !== undefined &&
      this.collateralProp.roofTruss !== undefined &&
      this.collateralProp.roof !== undefined
    ) {
      kosong = false;
    }

    return kosong;
  }
  public save(): void {
    if (this.collateralProp.id) {
      // update
      this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.collateralProp.attributes['floors'] = JSON.stringify(this.collateralProp.attributes['floors']);
      this.collateralPropertyService.create(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    }
  }
}
