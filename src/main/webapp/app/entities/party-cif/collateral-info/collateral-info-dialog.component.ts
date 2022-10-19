import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-party-cif-collateral-info-dialog',
  templateUrl: './collateral-info-dialog.component.html',
})
export class PartyCifCollateralInfoDialogComponent {
  public collateral: ICollateral;
  public disabledOpt = false;
  public collateralDetails: object[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
    },
    private _dialog: MatDialogRef<PartyCifCollateralInfoDialogComponent>
  ) {
    this.collateral = this.data.collateral;
    this.collateralDetails = [];
  }
}
