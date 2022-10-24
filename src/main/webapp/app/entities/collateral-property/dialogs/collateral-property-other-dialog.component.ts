import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import {
  GEO_BOUNDARY_TYPE,
  OTHER_COLLATERAL_DETAIL_TYPE,
  SECURITIES_MANAGEMENT_BRANCH,
  UOM_TYPE,
} from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-other-dialog',
  templateUrl: './collateral-property-other-dialog.component.html',
})
export class CollateralPropertyOtherDialogComponent implements OnInit {
  public collateralProperty: ICollateralProperty;
  public collateralDetailType: any;
  public managementBranches: any;
  public currencies: IUom[];
  public countries: IStateBoundary[];
  public provinces: IStateBoundary[];
  public cities: IStateBoundary[];
  public districts: IStateBoundary[];
  public villages: IStateBoundary[];
  constructor(
    private uomService: UomService,
    private stateBoundaryService: StateBoundaryService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _dialog: MatDialogRef<CollateralPropertyOtherDialogComponent>
  ) {
    this.collateralProperty = this.preLoadData(this.data.collateralProperty);
    this.managementBranches = SECURITIES_MANAGEMENT_BRANCH;
    this.collateralDetailType = OTHER_COLLATERAL_DETAIL_TYPE;
  }

  ngOnInit(): void {
    this.loadCountry();
  }

  public preLoadData(data: ICollateralProperty): ICollateralProperty {
    if (data.attributes.otherCountry) {
      data.attributes.otherCountry = parseInt(data.attributes.otherCountry, 10);
    }

    if (data.attributes.otherProvince) {
      data.attributes.otherProvince = parseInt(data.attributes.otherProvince, 10);
      const eventProvince: MatSelectChange = new MatSelectChange(null, null);
      eventProvince.value = data.attributes.otherProvince;
      this.loadCity(eventProvince);
    }
    if (data.attributes.otherCity) {
      data.attributes.otherCity = parseInt(data.attributes.otherCity, 10);
      const eventCity: MatSelectChange = new MatSelectChange(null, null);
      eventCity.value = data.attributes.otherCity;
      this.loadDistrict(eventCity);
    }
    if (data.attributes.otherDistrict) {
      data.attributes.realestateDistrict = parseInt(data.attributes.otherDistrict, 10);
      const eventDistrict: MatSelectChange = new MatSelectChange(null, null);
      eventDistrict.value = data.attributes.otherDistrict;
      this.loadVillage(eventDistrict);
    }
    if (data.attributes.otherVillage) {
      data.attributes.otherVillage = parseInt(data.attributes.otherVillage, 10);
    }
    return data;
  }

  public loadVillage(event: MatSelectChange): void {
    this.stateBoundaryService
      .queryFilterBy({
        idParent: event.value,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.villages = res.body;
      });
  }

  public loadDistrict(event: MatSelectChange): void {
    this.stateBoundaryService
      .queryFilterBy({
        idParent: event.value,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.districts = res.body;
      });
  }

  public loadCity(event: MatSelectChange): void {
    this.stateBoundaryService
      .queryFilterBy({
        idParent: event.value,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.cities = res.body;
      });
  }

  public loadProvince(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['province'],
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.provinces = res.body;
      });
  }

  private loadCountry(): void {
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

  public save(): void {
    this._dialog.close(this.collateralProperty);
  }
}
