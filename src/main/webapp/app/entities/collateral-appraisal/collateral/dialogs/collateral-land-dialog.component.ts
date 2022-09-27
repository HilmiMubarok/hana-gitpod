import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';

@Component({
  selector: 'jhi-collateral-land-dialog',
  templateUrl: './collateral-land-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralLandDialogComponent {
  public collateralProp: ICollateralProperty;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty },
    private _dialog: MatDialogRef<CollateralLandDialogComponent>,
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
      this.collateralPropertyService.create(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    }
  }

  numberInputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return Number(num);
  }
}
