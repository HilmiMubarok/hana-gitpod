import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import {
  COLLATERAL_DEPOSIT_DEBIT_BLOCK,
  GEO_BOUNDARY_TYPE,
  GUARANTEE_TYPE,
  REALESTATE_CERTIFICATE_TYPE,
  REALESTATE_COLLATERAL_DETAIL_TYPE,
  SECURITIES_MANAGEMENT_BRANCH,
  UOM_TYPE,
  PERSONAL_PROPERTIES_COLLATERAL_VEHICLES_DETAIL_TYPE,
  PERSONAL_PROPERTIES_COLLATERAL_MECHINE_DETAIL_TYPE,
  SECURITIES_COLLATERAL_DETAIL_TYPE,
  DEPOSIT_COLLATERAL_DETAIL_TYPE,
  GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE,
  PERSONAL_PROPERTIES_COLLATERAL_DETAIL_TYPE,
  OTHER_COLLATERAL_DETAIL_TYPE,
} from 'app/shared/constants/base.constants';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CollateralPropertyService } from '../collateral-property.service';
import lodash from 'lodash';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';

@Component({
  selector: 'jhi-collateral-property-vehicle-dialog',
  templateUrl: './collateral-property-vehicle-dialog.component.html',
})
export class CollateralPropertyVehicleDialogComponent implements OnInit, OnChanges {
  private _collateralProperty: ICollateralProperty;
  private _collateralPropertyExternal: ICollateralProperty;
  private _collateral: ICollateral;
  guaranteeType: any;
  debitBlock: any;
  public branceManagement: any;
  public branchesNames: any;
  public logoCcy = { prefix: '', thousands: ',', decimal: '.', precision: 0 };

  public myControl = new FormControl();
  public options: IUom[];
  public filteredOptions: Observable<IUom[]>;
  public Ccy: IUom;

  public myControlMVImb = new FormControl();
  public optionsMVImb: IUom[];
  public filteredOptionsMVImb: Observable<IUom[]>;
  public MVImbCcy: IUom;

  public myControlQuantity = new FormControl();
  public optionsQuantity: IUom[];
  public filteredOptionsQuantity: Observable<IUom[]>;
  public qty: IUom;

  @Input() public officerName;
  @Input() public branchId;

  @Input()
  get collateralPropertyExternal() {
    return this._collateralPropertyExternal;
  }

  set collateralPropertyExternal(param: ICollateralProperty) {
    this._collateralPropertyExternal = param;
  }

  @Input() // for internal purpose
  get collateralProperty() {
    return this._collateralProperty;
  }
  set collateralProperty(param: ICollateralProperty) {
    this._collateralProperty = this.preLoadData(param);
  }

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  public currencies: IUom[];
  public areaMeasure: IUom[];
  public displayColumns: string[] = ['no'];
  public collateralDetailType: any;
  public certificateType: any;
  public managementBranch: any;
  public provinces: IStateBoundary[];
  public cities: IStateBoundary[];
  public districts: IStateBoundary[];
  public villages: IStateBoundary[];
  public detailType: any;
  public collPropVehicle: ICollateralProperty[];
  public liquidValueMV: number;

  constructor(
    private uomService: UomService,
    protected partyCifService: PartyCifService,
    protected collateralPropertyService: CollateralPropertyService
  ) {
    this.certificateType = REALESTATE_CERTIFICATE_TYPE;
    this.managementBranch = SECURITIES_MANAGEMENT_BRANCH;
    this.guaranteeType = GUARANTEE_TYPE;
    this.debitBlock = COLLATERAL_DEPOSIT_DEBIT_BLOCK;
    this.collateralDetailType = REALESTATE_COLLATERAL_DETAIL_TYPE;
    this.collPropVehicle = [];
    this.liquidValueMV = 0;
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['collateral']) {
      await this.loadCollateralProperty(this.collateral.id);
      this.setLiquidValueMV();
    }
  }

  ngOnInit(): void {
    this.detailTypeChange(this.collateral.collateralTypeId);
    this.loadCurrencyMeasure();
    this.loadAreaMeasure();
    this.collateral.collateralTypeId;
    this.setManagementBrance();
    this.setBranches();
    this.setCertyficateType();
    this.cekDataSource();
    this.cekData();
  }

  private async loadCollateralProperty(collateralId: number): Promise<void> {
    const collProp: ICollateralProperty[] = (
      await firstValueFrom(this.collateralPropertyService.queryFilterBy({ idCollateral: collateralId, size: 9999, page: 0 }))
    ).body;
    if (collProp.length > 0) {
      this.collPropVehicle = lodash.filter(collProp, function (o) {
        return o.propertyType === CollateralPropertyType.VEHICLE;
      });
    }
  }

  private setLiquidValueMV(): void {
    this.liquidValueMV = this.collateralPropertyService.countVehicleLiquidationMarketValueRounding(this.collPropVehicle);
  }

  public cekData() {
    if (this.collateralProperty.attributes.branch === undefined) {
      this.collateralProperty.attributes.branch = this.branchId;
    }
    if (this.collateralProperty.attributes.managementBranch === undefined) {
      this.collateralProperty.attributes.managementBranch = '01';
    }
    if (this.collateralProperty.attributes.accountOfficer === undefined) {
      this.collateralProperty.attributes.accountOfficer = this.officerName;
    }
  }

  filtered() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }

  displayFn(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filter(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.options.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  filteredMVImb() {
    this.filteredOptionsMVImb = this.myControlMVImb.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVImb(name as string) : this.optionsMVImb.slice();
      })
    );
  }

  displayFnMVImb(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filterMVImb(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsMVImb.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  filteredQuantity() {
    this.filteredOptionsQuantity = this.myControlQuantity.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterQuantity(name as string) : this.optionsQuantity.slice();
      })
    );
  }

  displayFnQuantity(quantity: IUom): string {
    return quantity && quantity.id ? quantity.id : '';
  }

  private _filterQuantity(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsQuantity.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  public preLoadData(data: ICollateralProperty): ICollateralProperty {
    if (data.attributes.province) {
      data.attributes.province = parseInt(data.attributes.province, 10);
      const eventProvince: MatSelectChange = new MatSelectChange(null, null);
      eventProvince.value = data.attributes.province;
    }
    if (data.attributes.city) {
      data.attributes.city = parseInt(data.attributes.city, 10);
      const eventCity: MatSelectChange = new MatSelectChange(null, null);
      eventCity.value = data.attributes.city;
    }
    if (data.attributes.district) {
      data.attributes.district = parseInt(data.attributes.district, 10);
      const eventDistrict: MatSelectChange = new MatSelectChange(null, null);
      eventDistrict.value = data.attributes.district;
    }
    if (data.attributes.village) {
      data.attributes.village = parseInt(data.attributes.village, 10);
    }
    return data;
  }

  private loadCurrencyMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.CURRENCY,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.options = res.body;
        this.filtered();
        this.Ccy = this.options.find(obj => obj.id === this.collateralProperty.attributes.marketValueCcy);
        this.optionsMVImb = res.body;
        this.filteredMVImb();
        this.MVImbCcy = this.optionsMVImb.find(obj => obj.id === this.collateralProperty.attributes.marketValueImbCcy);
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
        this.optionsQuantity = res.body;
        this.filteredQuantity();
        // this.qty = this.optionsQuantity.find(obj => (obj.id = this.collateralProperty.attributes.quantitySizeUomId));
      });
  }

  public detailTypeChange(event) {
    switch (event) {
      case 'REALESTATE':
        this.collateralDetailType = REALESTATE_COLLATERAL_DETAIL_TYPE;
        break;
      case 'VEHICLE':
        this.collateralDetailType = PERSONAL_PROPERTIES_COLLATERAL_VEHICLES_DETAIL_TYPE;
        break;
      case 'MACHINE':
        this.collateralDetailType = PERSONAL_PROPERTIES_COLLATERAL_MECHINE_DETAIL_TYPE;
        break;
      case 'DEPOSIT':
        this.collateralDetailType = DEPOSIT_COLLATERAL_DETAIL_TYPE;
        break;
      case 'SECURITIES':
        this.collateralDetailType = SECURITIES_COLLATERAL_DETAIL_TYPE;
        break;
      case 'PERSONAL_PROPERTY':
        this.collateralDetailType = PERSONAL_PROPERTIES_COLLATERAL_DETAIL_TYPE;
        break;
      case 'LETTER_OF_GUARANTY':
        this.collateralDetailType = GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE;
        break;
      case 'OTHER':
        this.collateralDetailType = OTHER_COLLATERAL_DETAIL_TYPE;
        break;
      default:
        this.collateralDetailType;
        break;
    }
  }

  public dataSource() {
    if (this.collateral.dataSource === 'h' || this.collateral.dataSource === 'H') {
      return true;
    }
    return false;
  }

  public cekDataSource() {
    if (this.collateral?.dataSource === 'h' || this.collateral?.dataSource === 'H') {
      this.myControlQuantity.disable();
    }
    this.collateralProperty.attributes.marketValueCcy = 'IDR';
    this.collateralProperty.attributes.marketValueImbCcy = 'IDR';
    this.myControlMVImb.disable();
    this.myControl.disable();
  }

  public setManagementBrance() {
    this.partyCifService.getManagementBranc().subscribe(res => {
      this.branceManagement = res.body;
    });
  }

  public setBranches() {
    this.partyCifService.geBranches().subscribe(res => {
      this.branchesNames = res.body;
      console.log('vrk', this.branchesNames);
    });
  }

  public setCertyficateType() {
    this.partyCifService.getCertificate().subscribe(res => {
      this.certificateType = res.body;
    });
  }

  public getCcy() {
    this.collateralProperty.attributes.marketValueCcy = this.Ccy.id;
  }

  public getMVImbCcy() {
    this.collateralProperty.attributes.marketValueImbCcy = this.MVImbCcy.id;
  }

  public getQty() {
    // this.collateralProperty.attributes.quantitySizeUomId = this.qty.id;
    console.log(this.qty);
  }

  public sliceText(text: string) {
    return text.slice(5);
  }
}
