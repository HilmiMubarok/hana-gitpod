import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-land-dialog',
  templateUrl: './collateral-property-land-dialog.component.html',
})
export class CollateralPropertyLandDialogComponent {
  public collateralProperty: ICollateralProperty;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyLandDialogComponent>
  ) {
    this.collateralProperty = this.data.collateralProperty;
  }

  public numberInputChanged(value: any): number {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }
}
