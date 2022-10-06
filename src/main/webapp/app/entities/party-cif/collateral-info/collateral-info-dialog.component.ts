import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
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
export class PartyCifCollateralInfoDialogComponent implements OnInit {
  public subCollateralType: any;
  public collateral: ICollateral;
  public collateralTypes: ICollateralType[];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
    },
    private _dialog: MatDialogRef<PartyCifCollateralInfoDialogComponent>,
    private collateralTypeService: CollateralTypeService
  ) {
    this.collateral = this.data.collateral;
  }

  ngOnInit(): void {
    this.loadCollateralType();
  }

  public changeCollateralType(param: MatSelectChange): void {
    const value: string = param.value;
    if (value === COLLATERAL_TYPE['realestate']) {
      this.subCollateralType = SUB_COLLATERAL_TYPE_REALESTATE;
    } else if (value === COLLATERAL_TYPE['property']) {
      this.subCollateralType = SUB_COLLATERAL_TYPE_PROPERTY;
    } else if (value === COLLATERAL_TYPE['machine']) {
      this.subCollateralType = SUB_COLLATERAL_TYPE_MACHINE;
    } else if (value === COLLATERAL_TYPE['vehicle']) {
      this.subCollateralType = SUB_COLLATERAL_TYPE_VEHICLE;
    }
  }

  private loadCollateralType(): void {
    this.collateralTypeService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralTypes = res.body;
      });
  }
}
