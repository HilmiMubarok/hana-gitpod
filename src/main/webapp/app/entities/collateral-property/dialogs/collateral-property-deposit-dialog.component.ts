import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import {
  BANK_LIST,
  COLLATERAL_DEPOSIT_DEBIT_BLOCK,
  DEPOSIT_COLLATERAL_DETAIL_TYPE,
  GEO_BOUNDARY_TYPE,
  MANAGEMENT_BRANCH,
  UOM_TYPE,
} from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-deposit-dialog',
  templateUrl: './collateral-property-deposit-dialog.component.html',
})
export class CollateralPropertyDepositDialogComponent implements OnInit {
  public currencies: IUom[];
  public areaMeasure: IUom[];
  public debitBlock: any;
  public displayColumns: string[] = ['no'];
  public collateralProperty: ICollateralProperty;
  public bankList: any;
  public collateralDetailType: any;
  public managementBranch: any;
  public countries: IStateBoundary[];

  constructor(
    private uomService: UomService,
    private stateBoundaryService: StateBoundaryService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyDepositDialogComponent>
  ) {
    this.bankList = BANK_LIST;
    this.collateralProperty = this.preLoadData(this.data.collateralProperty);
    this.collateralDetailType = DEPOSIT_COLLATERAL_DETAIL_TYPE;
    this.managementBranch = MANAGEMENT_BRANCH;
    this.debitBlock = COLLATERAL_DEPOSIT_DEBIT_BLOCK;
  }

  ngOnInit(): void {
    this.loadCurrencyMeasure();
    this.loadAreaMeasure();
    this.loadCountry();
  }

  public preLoadData(data: ICollateralProperty): ICollateralProperty {
    if (data) {
      if (data.attributes.depositCountry) {
        data.attributes.depositCountry = parseInt(data.attributes.depositCountry, 10);
      }
    }
    return data;
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }

  public loadCountry(): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['country'], page: 0, size: 9999 }).subscribe(res => {
      this.countries = res.body;
    });
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
