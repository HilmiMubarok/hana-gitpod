import { Component, Inject, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-collateral-land-info-dialog',
  templateUrl: './collateral-land-info-dialog.component.html',
})
export class CollateralLandInfoDialogComponent implements OnInit {
  public collateralAppraisal: ICollateralAppraisal;
  public collateralProperty: ICollateralProperty;
  public account: Account;
  public hiddenRmAdmin: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collateralAppraisal: ICollateralAppraisal; collateralProperty: ICollateralProperty },
    private _dialog: MatDialogRef<CollateralLandInfoDialogComponent>,
    private accountService: AccountService
  ) {
    this.collateralProperty = this.data.collateralProperty;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }

  ngOnInit(): void {
    this.checkLogin();
    this.hiddenTombol();
  }

  public cancel(): void {
    this._dialog.close(this.data);
  }

  public save(): void {
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
  gakbisa() {
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
