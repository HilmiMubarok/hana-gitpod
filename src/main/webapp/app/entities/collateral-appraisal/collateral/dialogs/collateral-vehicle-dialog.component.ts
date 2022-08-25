import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';

@Component({
  selector: 'jhi-collateral-vehicle-dialog',
  templateUrl: './collateral-vehicle-dialog.component.html',
})
export class CollateralVehicleDialogComponent {
  public collateralProp: ICollateralProperty;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty }) {
    this.collateralProp = this.data.collateralProperty;
  }
}
