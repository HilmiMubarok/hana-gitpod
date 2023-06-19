import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
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
@Component({
  selector: 'jhi-collateral-property-securities-dialog',
  templateUrl: './collateral-property-securities-dialog.component.html',
})
export class CollateralPropertySecuritiesDialogComponent implements OnInit {
  private _pariPasu: string;
  @Input()
  get pariPasu() {
    return this._pariPasu;
  }
  set pariPasu(data: string) {
    this._pariPasu = data;
  }
  private _collateralProperty: ICollateralProperty;
  private _collateralPropertyExternal: ICollateralProperty;
  private _collateral: ICollateral;
  guaranteeType: any;
  debitBlock: any;
  public logoCcy = { prefix: '', thousands: ',', decimal: '.', precision: 0 };

  public myControlMVImb = new FormControl();
  public optionsMVImb: IUom[];
  public filteredOptionsMVImb: Observable<IUom[]>;
  public MVImbCcy: IUom;

  public myControlMVImbPs = new FormControl();
  public optionsMVImbPs: IUom[];
  public filteredOptionsMVImbPs: Observable<IUom[]>;
  public MVImbPsCcy: IUom;

  public myControlQuantity = new FormControl();
  public optionsQuantity: IUom[];
  public filteredOptionsQuantity: Observable<IUom[]>;
  public qty: IUom;
  public branchesNames = [];

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

  constructor(
    private uomService: UomService,
    private stateBoundaryService: StateBoundaryService,
    protected partyCifService: PartyCifService,
    public creditProposalService: CreditProposalService
  ) {
    this.certificateType = REALESTATE_CERTIFICATE_TYPE;
    this.managementBranch = SECURITIES_MANAGEMENT_BRANCH;
    this.guaranteeType = GUARANTEE_TYPE;
    // this.debitBlock = COLLATERAL_DEPOSIT_DEBIT_BLOCK;
    this.collateralDetailType = SECURITIES_COLLATERAL_DETAIL_TYPE;
  }

  ngOnInit(): void {
    this.detailTypeChange(this.collateral.collateralTypeId);
    this.loadCurrencyMeasure();
    this.loadAreaMeasure();
    this.loadProvince();
    this.collateral.collateralTypeId;
    this.setManagementBrance();
    this.cekDataSource();
    this.cekData();
    this.setBranches();
    this.setData();
    this.setDebitBlock();
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

  public setBranches() {
    this.partyCifService.geBranches().subscribe((res: any) => {
      this.branchesNames = res.body;
    });
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

  filteredMVImbPs() {
    this.filteredOptionsMVImbPs = this.myControlMVImbPs.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVImbPs(name as string) : this.optionsMVImbPs.slice();
      })
    );
  }

  displayFnMVImbPs(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filterMVImbPs(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsMVImbPs.filter(option => option.description.toLowerCase().includes(filterValue));
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
        this.optionsMVImb = res.body;
        this.filteredMVImb();
        this.MVImbCcy = this.optionsMVImb.find(obj => obj.id === this.collateralProperty.attributes.marketValueImbCcy);
        this.optionsMVImbPs = res.body;
        this.filteredMVImbPs();
        this.MVImbPsCcy = this.optionsMVImbPs.find(obj => obj.id === this.collateralProperty.marketValueOriginalCcy);
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
        this.qty = this.optionsQuantity.find(obj => (obj.id = this.collateralProperty.attributes.quantitySizeUomId));
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
      this.myControlMVImbPs.disable();
      this.myControlQuantity.disable();
    }
  }

  public setManagementBrance() {
    this.partyCifService.getManagementBranc().subscribe(res => {
      console.log('ini management branch', res.body);
      this.branceManagement = res.body;
    });
  }
  public currency = 0;

  public getMVImbCcy() {
    this.collateralProperty.attributes.marketValueImbCcy = this.MVImbCcy.id;
  }

  public getMVImbPsCcy() {
    this.collateralProperty.marketValueOriginalCcy = this.MVImbPsCcy.id;

    const setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService
      .getCurrency(this.collateralProperty.marketValueOriginalCcy, 'IDR', setDate.replace(/-/g, ''))
      .subscribe(res => {
        if (res.body[0]?.factor !== undefined) {
          this.currency = Number(res.body[0]?.factor);
          this.collateralProperty.liquidationValue = this.collateralProperty.attributes.totalFaceAmount * this.currency;
          this.collateralProperty.marketValue = this.collateralProperty.attributes.totalFaceAmount * this.currency;
        } else {
          this.currency = 0;
          this.collateralProperty.liquidationValue = this.collateralProperty.attributes.totalFaceAmount * this.currency;
          this.collateralProperty.marketValue = this.collateralProperty.attributes.totalFaceAmount * this.currency;
        }
      });
  }

  public getQty() {
    this.collateralProperty.attributes.quantitySizeUomId = this.qty.id;
  }

  public sliceText(text: string) {
    return text.slice(5);
  }

  public setData() {
    this.collateralProperty.liquidationValue = this.collateralProperty.attributes.totalFaceAmount;
    this.collateralProperty.marketValue = this.collateralProperty.attributes.totalFaceAmount;
  }

  public amountChange() {
    this.collateralProperty.liquidationValue = this.collateralProperty.attributes.totalFaceAmount * this.currency;
    this.collateralProperty.marketValue = this.collateralProperty.attributes.totalFaceAmount * this.currency;
  }

  public setDebitBlock() {
    this.partyCifService.getDebitBlock().subscribe(res => {
      this.debitBlock = res.body;
    });
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
  public filterDebit(data: number) {
    const value = this.debitBlock.filter(obj => obj.id === data);
    if (value.length > 0) {
      return this.debitBlock.filter(obj => obj.id === data)[0].label;
    } else {
      return '';
    }
  }
  public param(data: string) {
    const value = this.branceManagement.filter(obj => obj.id === data);
    if (value.length > 0) {
      return this.branceManagement.filter(obj => obj.id === data)[0].label;
    } else {
      return '';
    }
  }

  public filterBranch(data: string) {
    if (this.branchesNames.length > 0) {
      const branchValue = this.branchesNames.filter(obj => obj.id === data);
      if (branchValue.length > 0) {
        return this.branchesNames.filter(obj => obj.id === data)[0].name;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
