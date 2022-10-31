import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-machine-dialog',
  templateUrl: './collateral-property-machine-dialog.component.html',
})
export class CollateralPropertyMachineDialogComponent {
  public collateralProperty: ICollateralProperty;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyMachineDialogComponent>
  ) {
    this.collateralProperty = this.data.collateralProperty;
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }
}
