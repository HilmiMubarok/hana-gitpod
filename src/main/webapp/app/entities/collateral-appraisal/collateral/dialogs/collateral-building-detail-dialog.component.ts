import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';

@Component({
  selector: 'jhi-collateral-building-detail-dialog',
  templateUrl: './collateral-building-detail-dialog.component.html',
})
export class CollateralBuildingDetailDialogComponent {
  public collateralProp: ICollateralProperty;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty },
    private _dialog: MatDialogRef<CollateralBuildingDetailDialogComponent>,
    private collateralPropertyService: CollateralPropertyService
  ) {
    this.collateralProp = this.data.collateralProperty;
  }

  public save(): void {
    if (this.collateralProp.id) {
      // update
      this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.collateralProp.attributes['floors'] = JSON.stringify(this.collateralProp.attributes['floors']);
      this.collateralPropertyService.create(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    }
  }
}
