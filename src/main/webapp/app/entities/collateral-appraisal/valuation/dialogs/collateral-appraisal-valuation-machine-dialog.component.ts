import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-machine-dialog',
  templateUrl: './collateral-appraisal-valuation-machine-dialog.component.html',
  styleUrls: ['../collateral-appraisal-valuation.css'],
})
export class CollateralAppraisalValuationMachineDialogComponent {
  public collateralProp: ICollateralProperty;
  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralAppraisalValuationMachineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty }
  ) {
    this.collateralProp = this.data.collateralProperty;
  }

  public save(): void {
    this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
      this._dialog.close(res.body);
    });
  }
}
