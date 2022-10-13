import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-land-dialog',
  templateUrl: './collateral-appraisal-valuation-land-dialog.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationLandDialogComponent {
  public collateral: ICollateral;
  public area;
  constructor(
    private collateralService: CollateralService,
    private _dialog: MatDialogRef<CollateralAppraisalValuationLandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collateral: ICollateral; area }
  ) {
    this.collateral = this.data.collateral;
    this.area = this.data.area;
  }

  public save(): void {
    this.collateralService.update(this.collateral).subscribe(res => {
      this._dialog.close(res.body);
    });
  }

  currencyInputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return Number(num);
  }
  print() {
    console.log(this.area);
  }
}
