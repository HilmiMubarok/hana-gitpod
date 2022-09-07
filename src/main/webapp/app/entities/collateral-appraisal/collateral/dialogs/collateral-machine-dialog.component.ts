import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';

@Component({
  selector: 'jhi-collateral-machine-dialog',
  templateUrl: './collateral-machine-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralMachineDialogComponent {
  public collateralProp: ICollateralProperty;

  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralMachineDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    }
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
}
