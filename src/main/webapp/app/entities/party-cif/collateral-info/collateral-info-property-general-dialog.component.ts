import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CollateralProperty,
  CollateralPropertyDepositAttribute,
  CollateralPropertyGuaranteeAttribute,
  CollateralPropertyOtherAttribute,
  ICollateralProperty,
} from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';

@Component({
  selector: 'jhi-party-cif-collateral-info-property-general-dialog',
  templateUrl: './collateral-info-property-general-dialog.component.html',
})
export class PartyCifCollateralInfoPropertyGeneralDialogComponent implements OnInit {
  public collateral: ICollateral;
  public collateralProperty: ICollateralProperty;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
    },
    private _dialog: MatDialogRef<PartyCifCollateralInfoPropertyGeneralDialogComponent>,
    protected collateralPropertyService: CollateralPropertyService
  ) {
    this.collateral = this.data.collateral;
    this.collateralProperty = null;
  }

  ngOnInit(): void {
    this.loadByCollateral(this.collateral.id);
  }

  private loadByCollateral(collateralId: number): void {
    this.collateralPropertyService
      .queryFilterBy({
        page: 0,
        idCollateral: collateralId,
        idPropertyType: CollateralPropertyType.GENERAL,
        size: 1,
      })
      .subscribe(res => {
        if (res.body.length > 0) {
          this.collateralProperty = res.body[0];
        } else {
          this.collateralProperty = new CollateralProperty();
          this.collateralProperty.collateralId = collateralId;
          this.collateralProperty.partyId = this.collateral.partyId;
          this.collateralProperty.propertyType = CollateralPropertyType.GENERAL;

          if (this.collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
            this.collateralProperty.attributes = new CollateralPropertyGuaranteeAttribute();
          } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
            this.collateralProperty.attributes = new CollateralPropertyDepositAttribute();
          } else if (this.collateral.collateralTypeId === COLLATERAL_TYPE['other']) {
            this.collateralProperty.attributes = new CollateralPropertyOtherAttribute();
          }
        }
      });
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }
}
