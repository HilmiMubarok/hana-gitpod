import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import {
  GEO_BOUNDARY_TYPE,
  SECURITIES_COLLATERAL_DETAIL_TYPE,
  SECURITIES_MANAGEMENT_BRANCH,
  UOM_TYPE,
} from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../../../collateral-property.model';
import { CollateralParameterService } from 'app/entities/master-parameter/collateral-parameter/collateral-parameter.service';
import lodash from 'lodash';

@Component({
  selector: 'jhi-collateral-property-securities-general-dialog-template',
  templateUrl: './collateral-property-securities-general-dialog-template.component.html',
})
export class CollateralPropertySecuritiesGeneralDialogTemplateComponent implements OnInit {
  public currencies: IUom[];
  public areaMeasure: IUom[];
  public displayColumns: string[] = ['no'];
  public collateralDetailType: any;
  public managementBranch: any;
  public countries: IStateBoundary[];
  private _collateralProperty: ICollateralProperty;
  collateralDetailTypeValue: string;

  @Input()
  get collateralProperty() {
    return this._collateralProperty;
  }
  set collateralProperty(param: ICollateralProperty) {
    this._collateralProperty = this.preLoadData(param);
  }
  constructor(
    private uomService: UomService,
    private stateBoundaryService: StateBoundaryService,
    private collateralParameterService: CollateralParameterService
  ) {
    this.collateralDetailType = SECURITIES_COLLATERAL_DETAIL_TYPE;
    this.managementBranch = SECURITIES_MANAGEMENT_BRANCH;
  }

  ngOnInit(): void {
    this.loadCurrencyMeasure();
    this.loadAreaMeasure();
    this.loadCountry();
    this.changeCollateralType();
  }

  public preLoadData(data: ICollateralProperty): ICollateralProperty {
    if (data) {
      if (data.attributes.securitiesCountry) {
        data.attributes.securitiesCountry = parseInt(data.attributes.securitiesCountry, 10);
      }
    }
    return data;
  }

  public loadCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.countries = res.body;
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

  private loadAreaMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.AREAMEASURE,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.areaMeasure = res.body;
      });
  }

  public changeCollateralType(): void {
    this.collateralParameterService
      .queryFilterBy({
        collateralType: 'SECURITIES',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        // Filter status Active in collateral type
        this.collateralDetailType = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE' && o.collateralDetailTypeCode !== '';
        });
        if (this.collateralDetailType) {
          let element: string;
          for (let i = 0; i < this.collateralDetailType.length; i++) {
            if (this.collateralProperty.attributes.collateralDetailType === this.collateralDetailType[i].collateralDetailTypeCode) {
              element = this.collateralDetailType[i].collateralDetailTypeDescription;
            }
          }
          this.collateralDetailTypeValue = element;
        }
      });
  }
}
