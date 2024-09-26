import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { SurveyAppraisalsService } from '../../../survey-appraisals/survey-appraisals.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { TemplateService } from 'app/layouts/template/template.service';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import moment from 'moment-timezone';
import { formatDateWithTimezoneOffset } from 'app/shared/helper/utils';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

@Component({
  selector: 'jhi-collateral-building-detail-dialog',
  templateUrl: './collateral-building-detail-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
  providers: [{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }],
})
export class CollateralBuildingDetailDialogComponent implements OnInit {
  public collateralAppraisal: ICollateralAppraisal;
  public collateralProp: ICollateralProperty;
  public constructionData: any[];
  public foundationData: any[];
  public wallData: any[];
  public flooringData: any[];
  public ceilingData: any[];
  public roofTrussData: any[];
  public roofData: any[];
  public account: Account;
  public hiddenRmAdmin: boolean;
  /* public constructionData: Observable<any>;
  public foundationData: Observable<any>;
  public wallData: Observable<any>;
  public flooringData: Observable<any>;
  public ceilingData: Observable<any>;
  public roofTrussData: Observable<any>;
  public roofData: Observable<any>;
  public fields: Object = { text: 'label', value: 'id' }; */
  constructor(
    private templateService: TemplateService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty; collateralAppraisal: ICollateralAppraisal },
    private _dialog: MatDialogRef<CollateralBuildingDetailDialogComponent>,
    private collateralPropertyService: CollateralPropertyService,
    private surveyAppraisalsService: SurveyAppraisalsService,
    private _snackBar: MatSnackBar,
    private accountService: AccountService
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.collateralAppraisal = this.data.collateralAppraisal;
    this.getLov();
  }

  ngOnInit(): void {
    this.getRole();
    this.checkLogin();
    this.hiddenTombol();
  }

  public getRole() {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.checkRole(newPos.positionTypeId);
    });
  }

  public checkRole(param): void {
    if (param === 'SURVEYOR' || param === 'TL' || param === 'APR_DEPT_HEAD') {
      this._dialog.disableClose = true;
      this._dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
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

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close(this.collateralProp);
      }
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
  public cancel(): void {
    this._dialog.close(this.collateralProp);
  }
  public save(): void {
    if (this.collateralProp.imbDate !== null || this.collateralProp.imbDate !== undefined) {
      const imbDate = new Date(moment.tz(this.collateralProp.imbDate, 'Asia/Jakarta').toDate()).setHours(12);
      this.collateralProp.imbDate = moment(formatDateWithTimezoneOffset(new Date(imbDate))).toDate();
    }

    if (!this.collateralProp.buildingSpec) {
      this._snackBar.open('Masukan Building terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.construction) {
      this._snackBar.open('Masukan Construction terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (!this.collateralProp.foundation) {
      this._snackBar.open('Masukan Foundation terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.wall) {
      this._snackBar.open('Masukan Wall terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.flooring) {
      this._snackBar.open('Masukan Flooring terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.ceiling) {
      this._snackBar.open('Masukan Ceiling terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.roofTruss) {
      this._snackBar.open('Masukan Roof Truss terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.roof) {
      this._snackBar.open('Masukan Roof terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.imbArea) {
      this._snackBar.open('Masukkan IMB Area terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.propertyAreaTataKota) {
      this._snackBar.open('Masukkan Tata Kota Area terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (this.collateralProp.id) {
      // update
      this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    } else {
      this.collateralProp.attributes['floors'] = JSON.stringify(this.collateralProp.attributes['floors']);
      // create
      this.collateralPropertyService.create(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    }
  }
  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }

  private hiddenTombol() {
    if (this.isRm() || this.isAdminAppraisal()) {
      if (this.account.authorities.length <= 2) {
        if (
          this.collateralAppraisal.statusId === STATUS.ASSIGNED ||
          this.collateralAppraisal.statusId === STATUS.RETURN_TO_OFFICER ||
          this.collateralAppraisal.statusId === STATUS.APPROVAL_TL ||
          this.collateralAppraisal.statusId === STATUS.VISITED ||
          this.collateralAppraisal.statusId === STATUS.APPROVAL_DEPT_HEAD ||
          this.collateralAppraisal.statusId === STATUS.APPROVAL_DH
        ) {
          this.hiddenRmAdmin = true;
        }
      }
    }
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      this.hiddenRmAdmin = true;
    }
  }

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public isRm(): any {
    return this.account.authorities.includes('ROLE_RM');
  }
  public isAdminAppraisal(): any {
    return this.account.authorities.includes('ROLE_ADMIN_APPRAISER');
  }
}
