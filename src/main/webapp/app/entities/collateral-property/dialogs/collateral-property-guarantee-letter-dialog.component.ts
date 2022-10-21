import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import {
  GEO_BOUNDARY_TYPE,
  GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE,
  GUARANTEE_TYPE,
  GUARANTEE_BIS_COL_DETAIL_TYPE,
  UOM_TYPE,
} from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-guarantee-letter-dialog',
  templateUrl: './collateral-property-guarantee-letter-dialog.component.html',
})
export class CollateralPropertyGuaranteeLetterDialogComponent implements OnInit {
  public currencies: IUom[];
  public countries: IStateBoundary[];
  public areaMeasure: IUom[];
  public guaranteeType: any;
  public guaranteeBisColDetailType: any;
  public collateralDetailType: any;
  public collateralProperty: ICollateralProperty;
  constructor(
    private uomService: UomService,
    private stateBoundaryService: StateBoundaryService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyGuaranteeLetterDialogComponent>
  ) {
    this.collateralProperty = this.preload(this.data.collateralProperty);
    this.collateralDetailType = GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE;
    this.guaranteeType = GUARANTEE_TYPE;
    this.guaranteeBisColDetailType = GUARANTEE_BIS_COL_DETAIL_TYPE;
  }

  ngOnInit(): void {
    this.loadCurrencyMeasure();
    this.loadAreaMeasure();
    this.loadCountry();
  }

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }

  private preload(param: ICollateralProperty): ICollateralProperty {
    if (param.attributes.guaranteeCountry) {
      param.attributes.guaranteeCountry = parseInt(param.attributes.guaranteeCountry, 10);
    }
    return param;
  }

  private loadAreaMeasure(): void {
    this.uomService.queryFilterBy({ idUomType: UOM_TYPE.AREAMEASURE, page: 0, size: 9999 }).subscribe(res => {
      this.areaMeasure = res.body;
    });
  }

  private loadCurrencyMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.CURRENCY,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.currencies = res.body;
      });
  }

  public loadCountry(): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['country'], page: 0, size: 9999 }).subscribe(res => {
      this.countries = res.body;
    });
  }
}
