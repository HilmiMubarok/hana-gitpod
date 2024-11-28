import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import {
  COLLATERAL_DEPOSIT_DEBIT_BLOCK,
  COLLATERAL_TYPE,
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
import { map, Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { CollateralParameterService } from 'app/entities/master-parameter/collateral-parameter/collateral-parameter.service';
import lodash from 'lodash';
import { CredamService } from 'app/entities/dppk-finalize/credam.service';
export interface User {
  name: string;
}

@Component({
  selector: 'jhi-collateral-property-deposit-dialog',
  templateUrl: './collateral-property-deposit-dialog.component.html',
})
export class CollateralPropertyDepositDialogComponent implements OnInit {
  private _pariPasu: string;
  collateralDetailTypeValue: string;
  @Input()
  get pariPasu() {
    return this._pariPasu;
  }
  set pariPasu(data: string) {
    this._pariPasu = data;
  }
  public myControlCurrency = new FormControl();
  public optionsCurrency: IUom[];
  public filteredOptionsCurrency: Observable<IUom[]>;
  public amountCcy: IUom;

  public myControlMVImb = new FormControl();
  public optionsMVImb: IUom[];
  public filteredOptionsMVImb: Observable<IUom[]>;
  public MVImbCcy: IUom;

  public myControlQuantity = new FormControl();
  public optionsQuantity: IUom[];
  public filteredOptionsQuantity: Observable<IUom[]>;
  public qty: IUom;
  public currency = 0;

  private _collateralProperty: ICollateralProperty;
  private _collateralPropertyExternal: ICollateralProperty;
  private _collateral: ICollateral;
  public logoCcy = { prefix: '', thousands: ',', decimal: '.', precision: 0 };
  guaranteeType: any;
  debitBlock: any;

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
  public detailType;
  public branceManagement: any;
  public branchesNames: any;
  public isCredamOnIDD = false;

  constructor(
    private uomService: UomService,
    private stateBoundaryService: StateBoundaryService,
    private partyCifService: PartyCifService,
    public creditProposalService: CreditProposalService,
    private collateralParameterService: CollateralParameterService,
    private credamService: CredamService
  ) {
    this.certificateType = REALESTATE_CERTIFICATE_TYPE;
    this.managementBranch = SECURITIES_MANAGEMENT_BRANCH;
    this.guaranteeType = GUARANTEE_TYPE;
    // this.debitBlock = COLLATERAL_DEPOSIT_DEBIT_BLOCK;
    // this.collateralDetailType = DEPOSIT_COLLATERAL_DETAIL_TYPE;
  }

  ngOnInit(): void {
    this.detailTypeChange(this.collateral.collateralTypeId);
    this.loadCurrencyMeasure();
    this.loadAreaMeasure();
    this.loadProvince();
    this.collateral.collateralTypeId;
    this.setManagementBrance();
    this.setBranches();
    this.setDebitBlock();
    this.cekDataSource();
    this.cekData();
    this.setData();
    this.changeCollateralType();
    this.isCredamOnIDD = this.credamService.isCredamOnIDD();
  }

  cekData() {
    console.log('branch id ', this.branchId);
    if (this.collateralProperty.attributes.accountOfficer === undefined) {
      this.collateralProperty.attributes.accountOfficer = this.officerName;
    }
  }

  filteredCurrency() {
    this.filteredOptionsCurrency = this.myControlCurrency.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterCurrency(name as string) : this.optionsCurrency.slice();
      })
    );
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

  filteredQuantity() {
    this.filteredOptionsQuantity = this.myControlQuantity.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterQuantity(name as string) : this.optionsQuantity.slice();
      })
    );
  }

  displayFnCurrency(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  displayFnMVImb(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  displayFnQuantity(quantity: IUom): string {
    return quantity && quantity.description ? quantity.description : '';
  }

  private _filterCurrency(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsCurrency.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  private _filterMVImb(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsMVImb.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  private _filterQuantity(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsQuantity.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  // findIndex(array : IUom[]){
  //   const index1 = array.findIndex(x => x.abbreviation ==="IDR");
  //   const index2 = array.findIndex(x => x.abbreviation === "USD");
  //   const index3 = array.findIndex(x => x.abbreviation === "KRW");

  //   array = [array[index1], array[index2], array[index3]] = [array[0], array[1], array[2]];
  //   return array;
  // }

  public preLoadData(data: ICollateralProperty): ICollateralProperty {
    if (data.attributes.province) {
      data.attributes.province = parseInt(data.attributes.province, 10);
      const eventProvince: MatSelectChange = new MatSelectChange(null, null);
      eventProvince.value = data.attributes.province;
      this.loadCity(eventProvince);
    }
    if (data.attributes.city) {
      data.attributes.city = parseInt(data.attributes.city, 10);
      const eventCity: MatSelectChange = new MatSelectChange(null, null);
      eventCity.value = data.attributes.city;
      this.loadDistrict(eventCity);
    }
    if (data.attributes.district) {
      data.attributes.district = parseInt(data.attributes.district, 10);
      const eventDistrict: MatSelectChange = new MatSelectChange(null, null);
      eventDistrict.value = data.attributes.district;
      this.loadVillage(eventDistrict);
    }
    if (data.attributes.village) {
      data.attributes.village = parseInt(data.attributes.village, 10);
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

  private loadCurrencyMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.CURRENCY,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.optionsCurrency = res.body;
        this.optionsMVImb = res.body;
        this.amountCcy = this.optionsCurrency.find(obj => obj.id === this.collateralProperty.marketValueOriginalCcy);
        // this.options = this.findIndex(this.options);
        this.filteredCurrency();
        this.filteredMVImb();
        this.getAmountCcy();
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
      this.myControlMVImb.disable();
      this.myControlCurrency.disable();
      this.myControlQuantity.disable();
    }
  }

  public setManagementBrance() {
    this.partyCifService.getManagementBranc().subscribe(res => {
      this.branceManagement = res.body;
    });
  }

  public setBranches() {
    this.partyCifService.geBranches().subscribe(res => {
      this.branchesNames = res.body;
    });
  }

  public setDebitBlock() {
    this.partyCifService.getDebitBlock().subscribe(res => {
      this.debitBlock = res.body;
    });
  }

  public getAmountCcy() {
    this.collateralProperty.marketValueOriginalCcy = this.amountCcy.id;
    const setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService
      .getCurrency(this.collateralProperty.marketValueOriginalCcy, 'IDR', setDate.replace(/-/g, ''))
      .subscribe(res => {
        if (res.body[0]?.factor !== undefined) {
          this.currency = Number(res.body[0]?.factor);
          this.collateralProperty.liquidationValue = this.collateralProperty.attributes.amount * this.currency;
          this.collateralProperty.marketValue = this.collateralProperty.attributes.amount * this.currency;
        } else {
          this.currency = 0;
          this.collateralProperty.liquidationValue = this.collateralProperty.attributes.amount * this.currency;
          this.collateralProperty.marketValue = this.collateralProperty.attributes.amount * this.currency;
        }
      });
  }

  public getMVImbCcy() {
    this.collateralProperty.attributes.marketValueImbCcy = this.MVImbCcy.id;
  }

  public getQty() {
    this.collateralProperty.attributes.quantitySizeUomId = this.qty.abbreviation;
  }

  public setData() {
    this.collateralProperty.liquidationValue = this.collateralProperty.attributes.amount;
    this.collateralProperty.marketValue = this.collateralProperty.attributes.amount;
  }

  public amountChange() {
    this.collateralProperty.liquidationValue = this.collateralProperty.attributes.amount * this.currency;
    this.collateralProperty.marketValue = this.collateralProperty.attributes.amount * this.currency;
  }
  public filternameValue(data: string) {
    const keys = Object.keys(this.collateralDetailType);
    for (const key of keys) {
      if (key === data) {
        return this.collateralDetailType[key];
      }
    }
    return undefined;
  }
  public param(data: number) {
    const value = this.debitBlock.filter(obj => obj.id === data);
    if (value.length > 0) {
      return this.debitBlock.filter(obj => obj.id === data)[0].label;
    } else {
      return '';
    }
  }

  // Get Collateral Detail Type in Master Collateral
  public changeCollateralType(): void {
    this.collateralParameterService
      .queryFilterBy({
        collateralType: 'DEPOSIT',
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
