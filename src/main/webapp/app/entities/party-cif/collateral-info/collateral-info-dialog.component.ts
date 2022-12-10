import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-party-cif-collateral-info-dialog',
  templateUrl: './collateral-info-dialog.component.html',
})
export class PartyCifCollateralInfoDialogComponent {
  public collateral: ICollateral;
  @Input() collateralAppraisal: ICollateralAppraisal;
  public disabledOpt = false;
  public collateralDetails: object[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
      collateralAppraisal: ICollateralAppraisal;
    },
    private _dialog: MatDialogRef<PartyCifCollateralInfoDialogComponent>
  ) {
    this.collateral = this.data.collateral;
    this.collateralAppraisal = this.data.collateralAppraisal;
    this.collateralDetails = [];
  }

  public dataSource() {
    if (this.collateral.dataSource === 'h' || this.collateral.dataSource === 'H') {
      return true;
    }
    return false;
  }
}
