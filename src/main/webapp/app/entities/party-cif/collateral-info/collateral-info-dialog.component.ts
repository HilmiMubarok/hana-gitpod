import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import {
  COLLATERAL_TYPE,
  SUB_COLLATERAL_TYPE_MACHINE,
  SUB_COLLATERAL_TYPE_PROPERTY,
  SUB_COLLATERAL_TYPE_REALESTATE,
  SUB_COLLATERAL_TYPE_VEHICLE,
} from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-party-cif-collateral-info-dialog',
  templateUrl: './collateral-info-dialog.component.html',
})
export class PartyCifCollateralInfoDialogComponent {
  public collateral: ICollateral;
  public disabledOpt = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
    },
    private _dialog: MatDialogRef<PartyCifCollateralInfoDialogComponent>,
    private collateralTypeService: CollateralTypeService,
    private collateralService: CollateralService
  ) {
    this.collateral = this.data.collateral;
  }
}
