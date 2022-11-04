import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';

@Component({
  selector: 'jhi-collateral-machine-dialog',
  templateUrl: './collateral-machine-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralMachineDialogComponent {
  public collateralProp: ICollateralProperty;

  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralMachineDialogComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    }
  ) {
    this.collateralProp = this.data.collateralProperty;
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
}
