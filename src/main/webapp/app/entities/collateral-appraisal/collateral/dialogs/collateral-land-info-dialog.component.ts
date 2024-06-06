import { Component, Inject, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { TemplateService } from 'app/layouts/template/template.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'jhi-collateral-land-info-dialog',
  templateUrl: './collateral-land-info-dialog.component.html',
  styleUrls: ['./collateral-land-info-dialog.style.scss'],
})
export class CollateralLandInfoDialogComponent implements OnInit {
  public collateralAppraisal: ICollateralAppraisal;
  public collateralProperty: ICollateralProperty;
  public account: Account;
  public hiddenRmAdmin: boolean;
  constructor(
    private templateService: TemplateService,
    protected dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { collateralAppraisal: ICollateralAppraisal; collateralProperty: ICollateralProperty },
    private _dialog: MatDialogRef<CollateralLandInfoDialogComponent>,
    private accountService: AccountService,
    private _snackBar: MatSnackBar
  ) {
    this.collateralProperty = this.data.collateralProperty;
    this.collateralAppraisal = this.data.collateralAppraisal;
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

  public cancel(): void {
    this._dialog.close(this.data);
  }

  public save(): void {
    if (!this.collateralProperty.description) {
      this._snackBar.open('Masukkan Object Name terlebih dahulu', null, {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProperty.landSizePerCertificate) {
      this._snackBar.open('Masukkan Area terlebih dahulu', null, {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 3000,
      });
      return;
    }
    this._dialog.close(this.collateralProperty);
  }

  // public disableButton() {
  //   let kosong: boolean;
  //   kosong = true;
  //   if (
  //     this.collateralProperty.description !== '' &&  this.collateralProperty.description !== undefined &&
  //     this.collateralProperty.landSizePerCertificate !== null && this.collateralProperty.landSizePerCertificate !== undefined
  //   ) {
  //     kosong = false;
  //   }
  //   return kosong;
  // }

  public print() {
    console.log(this.collateralProperty.description);
  }
  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
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
        this._dialog.close(this.data);
      }
    });
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
