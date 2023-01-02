import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
@Component({
  selector: 'jhi-collateral-machine-dialog',
  templateUrl: './collateral-machine-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralMachineDialogComponent implements OnInit {
  public collateralProp: ICollateralProperty;
  public collateralAppraisal: ICollateralAppraisal;
  public account: Account;
  public hiddenRmAdmin: boolean;

  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralMachineDialogComponent>,
    private _snackBar: MatSnackBar,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
      collateralAppraisal: ICollateralAppraisal;
    }
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }

  ngOnInit(): void {
    this.checkLogin();
    this.hiddenTombol();
  }

  public cancel(): void {
    this._dialog.close(this.collateralProp);
  }

  public save(): void {
    if (!this.collateralProp.machineName) {
      this._snackBar.open('Masukan Machine Name terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineDocType) {
      this._snackBar.open('Masukan Type document terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (!this.collateralProp.machineDocNum) {
      this._snackBar.open('Masukan No Document terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineDate) {
      this._snackBar.open('Masukan Tanggal terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineDateFrom) {
      this._snackBar.open('Masukan From terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineAmount) {
      this._snackBar.open('Masukan Amount terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineMerk) {
      this._snackBar.open('Masukan Merek mesin terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineMadeBy) {
      this._snackBar.open('Masukan Buatan terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineYear) {
      this._snackBar.open('Masukan Tahun terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineModelType) {
      this._snackBar.open('Masukan Type Model terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineType) {
      this._snackBar.open('Masukan Jenis terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineMfgDate) {
      this._snackBar.open('Masukan MFG Date terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineSpec) {
      this._snackBar.open('Masukan Jenis terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.machineCondition) {
      this._snackBar.open('Masukan Kondisi terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (!this.collateralProp.machineNotes) {
      this._snackBar.open('Masukan Keterangan terlebih dahulu', null, {
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
