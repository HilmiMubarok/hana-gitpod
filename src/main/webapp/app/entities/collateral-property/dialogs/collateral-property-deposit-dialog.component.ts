import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { BANK_LIST, DEPOSIT_COLLATERAL_DETAIL_TYPE, MANAGEMENT_BRANCH, UOM_TYPE } from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-deposit-dialog',
  templateUrl: './collateral-property-deposit-dialog.component.html',
})
export class CollateralPropertyDepositDialogComponent implements OnInit {
  public currencies: IUom[];
  public areaMeasure: IUom[];
  public displayColumns: string[] = ['no'];
  public collateralProperty: ICollateralProperty;
  public bankList: any;
  public collateralDetailType: any;
  public managementBranch: any;

  constructor(
    private uomService: UomService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyDepositDialogComponent>
  ) {
    this.bankList = BANK_LIST;
    this.collateralProperty = this.data.collateralProperty;
    this.collateralDetailType = DEPOSIT_COLLATERAL_DETAIL_TYPE;
    this.managementBranch = MANAGEMENT_BRANCH;
  }

  ngOnInit(): void {
    this.loadCurrencyMeasure();
    this.loadAreaMeasure();
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }

  private loadCurrencyMeasure(): void {
    this.uomService.queryFilterBy({ idUomType: UOM_TYPE.CURRENCY, page: 0, size: 9999 }).subscribe(res => {
      this.currencies = res.body;
    });
  }

  private loadAreaMeasure(): void {
    this.uomService.queryFilterBy({ idUomType: UOM_TYPE.AREAMEASURE, page: 0, size: 9999 }).subscribe(res => {
      this.areaMeasure = res.body;
    });
  }
}
