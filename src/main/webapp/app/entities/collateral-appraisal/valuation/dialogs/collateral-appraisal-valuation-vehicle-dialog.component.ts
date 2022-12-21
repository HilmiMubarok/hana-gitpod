import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
@Component({
  selector: 'jhi-collateral-appraisal-valuation-vehicle-dialog',
  templateUrl: './collateral-appraisal-valuation-vehicle-dialog.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationVehicleDialogComponent {
  public collateralProp: ICollateralProperty;
  public collateralAppraisal: ICollateralAppraisal;
  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralAppraisalValuationVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collateralProperty: ICollateralProperty; collateralAppraisal: ICollateralAppraisal }
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }
  public cancel(): void {
    this._dialog.close(this.collateralProp);
  }
  public save(): void {
    this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
      this._dialog.close(res.body);
    });
  }
  gakbisa() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
}
