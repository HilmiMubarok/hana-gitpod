import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';

@Component({
  selector: 'jhi-collateral-vehicle-dialog',
  templateUrl: './collateral-vehicle-dialog.component.html',
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
}
