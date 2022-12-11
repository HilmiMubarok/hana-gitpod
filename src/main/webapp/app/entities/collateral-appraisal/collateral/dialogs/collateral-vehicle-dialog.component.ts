import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-collateral-vehicle-dialog',
  templateUrl: './collateral-vehicle-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralVehicleDialogComponent {
  public collateralProp: ICollateralProperty;
  public collateralAppraisal: ICollateralAppraisal;
  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralVehicleDialogComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralAppraisal: ICollateralAppraisal;
      collateralProperty: ICollateralProperty;
    }
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }
  public close(): void {
    this._dialog.close(this.collateralProp);
  }
  public save(): void {
    if (!this.collateralProp.bpkbNum) {
      this._snackBar.open('Masukan BPKB Number terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.bpkbName) {
      this._snackBar.open('Masukan BPKB Nama terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehNum) {
      this._snackBar.open('Masukan Vehicle Number terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehYear) {
      this._snackBar.open('Masukan Vehicle Year terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.stnkNum) {
      this._snackBar.open('Masukan STNK Number terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.chassisNum) {
      this._snackBar.open('Masukan Chassis Number terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehMachineNum) {
      this._snackBar.open('Masukan Machine Number terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehInvNum) {
      this._snackBar.open('Masukan Invoice Number terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehUsedBy) {
      this._snackBar.open('Masukan Used By terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehBrand) {
      this._snackBar.open('Masukan Brand terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehType) {
      this._snackBar.open('Masukan Type terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehCategory) {
      this._snackBar.open('Masukan Category terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    // baru
    if (!this.collateralProp.vehModel) {
      this._snackBar.open('Masukan Model terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehCylinder) {
      this._snackBar.open('Masukan Cyclinder terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehColour) {
      this._snackBar.open('Masukan Color terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehFuel) {
      this._snackBar.open('Masukan Fuel terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehtransmission) {
      this._snackBar.open('Masukan Transmission terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehWheelsTtl) {
      this._snackBar.open('Masukan Number of Wheels terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehUnitCond) {
      this._snackBar.open('Masukan Unit Condition terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.collateralProp.vehNotes) {
      this._snackBar.open('Masukan Description terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (this.collateralProp.id) {
      // update
      this.collateralPropertyService.save(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.collateralPropertyService.create(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    }
  }
  gakbisa() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE) {
      return true;
    }
    return false;
  }
}
