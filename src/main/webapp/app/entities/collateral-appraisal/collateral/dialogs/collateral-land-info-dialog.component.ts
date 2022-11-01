import { Component, Inject } from '@angular/core';
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

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }
}
