import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { UOM_TYPE } from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-deposit-dialog',
  templateUrl: './collateral-property-deposit-dialog.component.html',
})
export class CollateralPropertyDepositDialogComponent implements OnInit {
  public currencies: IUom[];
  public displayColumns: string[] = ['no'];
  public collateralProperty: ICollateralProperty;

  constructor(
    private uomService: UomService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyDepositDialogComponent>
  ) {
    this.collateralProperty = this.data.collateralProperty;
  }

  ngOnInit(): void {
    this.loadCurrencyMeasure();
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }

  private loadCurrencyMeasure(): void {
    this.uomService.queryFilterBy({ idUomType: UOM_TYPE.CURRENCY, page: 0, size: 9999 }).subscribe(res => {
      this.currencies = res.body;
    });
  }
}
