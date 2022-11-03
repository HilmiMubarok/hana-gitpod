import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-vehicle-dialog',
  templateUrl: './collateral-property-vehicle-dialog.component.html',
})
export class CollateralPropertyVehicleDialogComponent {
  public collateralProp: ICollateralProperty;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyVehicleDialogComponent>
  ) {
    this.collateralProp = this.data.collateralProperty;
  }

  public save(): void {
    this._dialog.close(this.collateralProp);
  }
}
