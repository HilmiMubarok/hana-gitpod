import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
@Component({
  selector: 'jhi-collateral-appraisal-valuation-land-dialog',
  templateUrl: './collateral-appraisal-valuation-land-dialog.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationLandDialogComponent implements OnChanges {
  public collateral: ICollateral;
  public collateralProperties: ICollateralProperty;
  collateralAppraisal: ICollateralAppraisal;
  public area;
  constructor(
    private collateralService: CollateralService,
    private _dialog: MatDialogRef<CollateralAppraisalValuationLandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collateral: ICollateral; area; collateralProperties: ICollateralProperty }
  ) {
    this.collateral = this.data.collateral;
    this.area = this.data.area;
  }
  public cancel(): void {
    this._dialog.close(this.collateral);
  }
  public save(): void {
    this.collateralService.update(this.collateral).subscribe(res => {
      this._dialog.close(res.body);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fnCountTotalMVTataKota();
  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
  print() {
    console.log(this.area);
  }

  public fnCountTotalMVTataKota() {
    let result: number;
    result = 0;

    result = result + this.collateralProperties.propertyMarketValueTataKotaPerMeter * this.collateralProperties.landSizePerCertificate;
  }
  gakbisa() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE) {
      return true;
    }
    return false;
  }
}
