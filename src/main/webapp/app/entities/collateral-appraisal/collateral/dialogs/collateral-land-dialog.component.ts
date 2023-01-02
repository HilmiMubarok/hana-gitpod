import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateral, ICollateralLandAttribute } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import lodash from 'lodash';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-collateral-land-dialog',
  templateUrl: './collateral-land-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralLandDialogComponent implements OnInit {
  public collateralAppraisal: ICollateralAppraisal;
  public collateralLandAttribute: ICollateralLandAttribute;
  private collateral: ICollateral;
  public account: Account;
  public hiddenRmAdmin: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { collateralAppraisal: ICollateralAppraisal; collateralLandAttribute: ICollateralLandAttribute; collateral: ICollateral },
    private _dialog: MatDialogRef<CollateralLandDialogComponent>,
    private collateralService: CollateralService,
    private accountService: AccountService
  ) {
    this.collateralLandAttribute = this.data.collateralLandAttribute;
    this.collateral = this.data.collateral;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }

  ngOnInit(): void {
    this.checkLogin();
    this.hiddenTombol();
  }

  public cancel(): void {
    this._dialog.close(this.collateral);
  }
  public save(): void {
    const landAttr: ICollateralLandAttribute = this.collateralLandAttribute;
    const idx = lodash.findIndex(this.collateral.attributes.landCertificates, function (o: ICollateralLandAttribute) {
      return o.id === landAttr.id;
    });

    // update or create
    if (idx > -1) {
      this.collateral.attributes['landCertificates'][idx] = lodash.cloneDeep(landAttr);
    } else {
      this.collateral.attributes['landCertificates'].push(landAttr);
    }
    const copyCollateral = lodash.cloneDeep(this.collateral);
    copyCollateral.attributes['landCertificates'] = JSON.stringify(copyCollateral.attributes['landCertificates']);

    this.collateralService.update(copyCollateral).subscribe(res => {
      this._dialog.close(this.collateral);
    });
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
