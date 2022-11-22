import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';

@Component({
  selector: 'jhi-collateral-land-info-dialog',
  templateUrl: './collateral-land-info-dialog.component.html',
})
export class CollateralLandInfoDialogComponent {
  public collateralProperty: ICollateralProperty;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty },
    private _dialog: MatDialogRef<CollateralLandInfoDialogComponent>
  ) {
    this.collateralProperty = this.data.collateralProperty;
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
}
