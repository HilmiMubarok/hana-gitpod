import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateral, ICollateralLandAttribute } from 'app/entities/collateral/collateral.model';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-certificates-dialog',
  templateUrl: './collateral-property-certificates-dialog.component.html',
})
export class CollateralPropertyCertificatesDialogComponent {
  public collateralLandAttribute: ICollateralLandAttribute;
  public collateral: ICollateral;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralLandAttribute: ICollateralLandAttribute;
      collateral: ICollateral;
    },
    private _dialog: MatDialogRef<CollateralPropertyCertificatesDialogComponent>
  ) {
    this.collateralLandAttribute = this.data.collateralLandAttribute;
    this.collateral = this.data.collateral;
  }

  public numberInputChanged(value: any): number {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public save(): void {
    this._dialog.close(this.collateralLandAttribute);
  }
}
