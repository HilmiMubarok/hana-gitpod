import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-land-info-dialog',
  templateUrl: './collateral-property-land-info-dialog.component.html',
})
export class CollateralPropertyLandInfoDialogComponent implements OnInit {
  public collateralProperty: ICollateralProperty;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyLandInfoDialogComponent>
  ) {
    this.collateralProperty = this.data.collateralProperty;
  }

  ngOnInit(): void {
    console.log('ini property', this.collateralProperty);
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }
}
