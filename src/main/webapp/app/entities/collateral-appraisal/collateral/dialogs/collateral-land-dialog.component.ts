import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateral, ICollateralLandAttribute } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import lodash from 'lodash';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-collateral-land-dialog',
  templateUrl: './collateral-land-dialog.component.html',
  styleUrls: ['./collateral-dialog.css'],
})
export class CollateralLandDialogComponent {
  public collateralAppraisal: ICollateralAppraisal;
  public collateralLandAttribute: ICollateralLandAttribute;
  private collateral: ICollateral;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { collateralAppraisal: ICollateralAppraisal; collateralLandAttribute: ICollateralLandAttribute; collateral: ICollateral },
    private _dialog: MatDialogRef<CollateralLandDialogComponent>,
    private collateralService: CollateralService
  ) {
    this.collateralLandAttribute = this.data.collateralLandAttribute;
    this.collateral = this.data.collateral;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }
  public cancel(): void {
    this._dialog.close(this.collateral);
  }
  public save(): void {
    const landAttr: ICollateralLandAttribute = this.collateralLandAttribute;
    const idx = lodash.findIndex(this.collateral.attributes.landCertificates, function (o: ICollateralLandAttribute) {
      return o.id === landAttr.id;
    });

    // update or create
    if (idx > -1) {
      this.collateral.attributes['landCertificates'][idx] = lodash.cloneDeep(landAttr);
    } else {
      this.collateral.attributes['landCertificates'].push(landAttr);
    }
    const copyCollateral = lodash.cloneDeep(this.collateral);
    copyCollateral.attributes['landCertificates'] = JSON.stringify(copyCollateral.attributes['landCertificates']);

    this.collateralService.update(copyCollateral).subscribe(res => {
      this._dialog.close(this.collateral);
    });
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
  gakbisa() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE) {
      return true;
    }
    return false;
  }
}
