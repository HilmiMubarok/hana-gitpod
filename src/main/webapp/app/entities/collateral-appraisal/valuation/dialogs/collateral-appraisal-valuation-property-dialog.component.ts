import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
@Component({
  selector: 'jhi-collateral-appraisal-valuation-property-dialog',
  templateUrl: './collateral-appraisal-valuation-property-dialog.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationPropertyDialogComponent implements OnChanges {
  public collateralProp: ICollateralProperty;
  public collateralAppraisal: ICollateralAppraisal;
  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralAppraisalValuationPropertyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collateralAppraisal: ICollateralAppraisal; collateralProperty: ICollateralProperty }
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.collateralProp.propertyType === CollateralPropertyType.LAND) {
      this.getMarketValueImbLand();
    } else {
      this.getMarketValueImbBuilding();
    }
  }

  public cancel(): void {
    this._dialog.close(this.collateralProp);
  }
  public save(): void {
    this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
      this._dialog.close(res.body);
    });
  }

  public getMarketValueImbLand() {
    this.collateralProp.propertyMarketValue = this.collateralProp.landSizePerCertificate * this.collateralProp.propertyMarketValuePerMeter;
  }

  public getMarketValueImbBuilding() {
    this.collateralProp.propertyMarketValue = this.collateralProp.imbArea * this.collateralProp.propertyMarketValuePerMeter;
  }

  public totalArea: number;
  public countTotalArea(): number {
    this.totalArea = 0;

    if (this.collateralProp.propertyType === CollateralPropertyType.BUILDING) {
      if (lodash.has(this.collateralProp.attributes, 'floors')) {
        const floors: object[] = JSON.parse(this.collateralProp.attributes['floors']);
        if (floors.length > 0) {
          for (let i = 0; i < floors.length; i++) {
            const floor: object = floors[i];
            this.totalArea = this.totalArea + parseInt(floor['area'], 10);
          }
        }
      }
    }

    return this.totalArea;
  }
  gakbisa() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
}
