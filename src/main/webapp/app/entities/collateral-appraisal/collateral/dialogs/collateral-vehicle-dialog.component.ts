import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';

@Component({
  selector: 'jhi-collateral-vehicle-dialog',
  templateUrl: './collateral-vehicle-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralVehicleDialogComponent {
  public collateralProp: ICollateralProperty;
  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty }
  ) {
    this.collateralProp = this.data.collateralProperty;
  }

  public save(): void {
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

  // public disableButton() {
  //   let kosong: boolean;
  //   kosong = true;
  //   if (
  //     this.collateralProp.bpkbNum !== '' && this.collateralProp.bpkbNum !== undefined &&
  //     this.collateralProp.bpkbName !== '' && this.collateralProp.bpkbName !== undefined &&
  //     this.collateralProp.vehNum !== '' && this.collateralProp.vehNum !== undefined &&
  //     this.collateralProp.vehYear !== null && this.collateralProp.vehYear !== undefined &&
  //     this.collateralProp.stnkNum !== '' && this.collateralProp.stnkNum !== undefined &&
  //     this.collateralProp.chassisNum !== '' && this.collateralProp.chassisNum !== undefined &&
  //     this.collateralProp.vehMachineNum !== '' && this.collateralProp.vehMachineNum !== undefined &&
  //     this.collateralProp.vehInvNum !== '' && this.collateralProp.vehInvNum !== undefined &&
  //     this.collateralProp.vehUsedBy !== '' && this.collateralProp.vehUsedBy !== undefined &&
  //     this.collateralProp.vehBrand !== '' && this.collateralProp.vehBrand !== undefined &&
  //     this.collateralProp.vehType !== '' && this.collateralProp.vehType !== undefined &&
  //     this.collateralProp.vehCategory !== '' && this.collateralProp.vehCategory !== undefined &&
  //     this.collateralProp.vehModel !== '' && this.collateralProp.vehModel !== undefined &&
  //     this.collateralProp.vehCylinder !== '' && this.collateralProp.vehCylinder !== undefined &&
  //     this.collateralProp.vehColour !== '' && this.collateralProp.vehColour !== undefined &&
  //     this.collateralProp.vehFuel !== '' && this.collateralProp.vehFuel !== undefined &&
  //     this.collateralProp.vehtransmission !== '' && this.collateralProp.vehtransmission !== undefined &&
  //     this.collateralProp.vehWheelsTtl !== '' && this.collateralProp.vehWheelsTtl !== undefined &&
  //     this.collateralProp.vehUnitCond !== '' && this.collateralProp.vehUnitCond !== undefined &&
  //     this.collateralProp.vehNotes !== '' && this.collateralProp.vehNotes !== undefined
  //   ) {
  //     kosong = false;
  //   }
  //   return kosong;
  // }
}
