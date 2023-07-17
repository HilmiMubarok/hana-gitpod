import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
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
import lodash from 'lodash';
import { FormControl } from '@angular/forms';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { CollateralPropertyService } from '../collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { CollateralParameterService } from 'app/entities/master-parameter/collateral-parameter/collateral-parameter.service';

@Component({
  selector: 'jhi-collateral-property-machine-dialog',
  templateUrl: './collateral-property-machine-dialog.component.html',
})
export class CollateralPropertyMachineDialogComponent implements OnInit, OnChanges {
  private _pariPasu: string;
  collateralDetailTypeValue: string;
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

  public myControl = new FormControl();
  public options: IUom[];
  public filteredOptions: Observable<IUom[]>;
  public Ccy: IUom;
  public collPropMachine: ICollateralProperty[];
  public liquidValueMV: number;

  public myControlMVImb = new FormControl();
  public optionsMVImb: IUom[];
  public filteredOptionsMVImb: Observable<IUom[]>;
  public MVImbCcy: IUom;

  public myControlMVOri = new FormControl();
  public optionsMVOri: IUom[];
  public filteredOptionsMVOri: Observable<IUom[]>;
  public MVOriCcy: IUom;

  @Input() public officerName: string;
  @Input() public branchId: string;

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
  public branceManagement: any;
  public branchesNames: any;

  constructor(
    private uomService: UomService,
    private stateBoundaryService: StateBoundaryService,
    private partyCifService: PartyCifService,
    private collateralPropertyService: CollateralPropertyService,
    protected generalParameterService: GeneralParameterService,
    private collateralParameterService: CollateralParameterService
  ) {
    // this.certificateType = REALESTATE_CERTIFICATE_TYPE;
    this.managementBranch = SECURITIES_MANAGEMENT_BRANCH;
    this.guaranteeType = GUARANTEE_TYPE;
    this.debitBlock = COLLATERAL_DEPOSIT_DEBIT_BLOCK;
    // this.collateralDetailType = PERSONAL_PROPERTIES_COLLATERAL_MECHINE_DETAIL_TYPE;
    this.collPropMachine = [];
    this.liquidValueMV = 0;
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['collateral']) {
      await this.loadCollateralProperty(this.collateral.id);
      this.setLiquidValueMV();
    }
    if (changes['collateralProperty']) {
      console.log('collateral property ', this.collateralProperty);
    }
  }

  ngOnInit(): void {
    this.detailTypeChange(this.collateral.collateralTypeId);
    this.loadCurrencyMeasure();
    this.loadProvince();
    this.collateral.collateralTypeId;
    this.setManagementBrance();
    this.setBranches();
    // this.setCertyficateType();
    this.dataSource();
    this.cekData();
    this.cekDataSource();
    this.lovcertificateType();
    this.changeCollateralType();
  }

  private async loadCollateralProperty(collateralId: number): Promise<void> {
    const collProp: ICollateralProperty[] = (
      await firstValueFrom(this.collateralPropertyService.queryFilterBy({ idCollateral: collateralId, size: 9999, page: 0 }))
    ).body;
    if (collProp.length > 0) {
      this.collPropMachine = lodash.filter(collProp, function (o) {
        return o.propertyType === CollateralPropertyType.MACHINE;
      });
    }
  }

  private setLiquidValueMV(): void {
    this.liquidValueMV = this.collateralPropertyService.countMachineLiquidationMarketValueRounding(this.collPropMachine);
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

  displayFn(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filter(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.options.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  filteredMVOri() {
    this.filteredOptionsMVOri = this.myControlMVOri.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVOri(name as string) : this.optionsMVOri.slice();
      })
    );
  }

  displayFnMVImb(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  displayFnMVOri(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filterMVImb(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsMVImb.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  private _filterMVOri(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsMVOri.filter(option => option.description.toLowerCase().includes(filterValue));
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
        this.options = res.body;
        this.Ccy = this.options.find(obj => obj.id === this.collateralProperty.attributes.marketValueCcy);
        this.optionsMVOri = res.body;
        this.filteredMVOri();
        this.MVOriCcy = this.optionsMVOri.find(obj => obj.id === this.collateralProperty.marketValueOriginalCcy);
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
    this.myControlMVImb.disable();
    this.myControlMVOri.disable();
    this.myControl.disable();
    this.collateralProperty.attributes.marketValueCcy = 'IDR';
    this.collateralProperty.attributes.marketValueImbCcy = 'IDR';
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

  public lovcertificateType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'CERTIFICATE_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.certificateType = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public getCcy() {
    this.collateralProperty.attributes.marketValueCcy = this.Ccy.id;
  }

  public getMVOriCcy() {
    this.collateralProperty.marketValueOriginalCcy = this.MVOriCcy.id;
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

  public filtercertificateType(data: string) {
    const value = this.certificateType.filter(obj => obj.code === data);
    if (value.length > 0) {
      return this.certificateType.filter(obj => obj.code === data)[0].value;
    } else {
      return '';
    }
  }

  public param(data: number) {
    const value = this.branceManagement.filter(obj => obj.id === data);
    if (value.length > 0) {
      return this.branceManagement.filter(obj => obj.id === data)[0].label;
    } else {
      return '';
    }
  }

  public filterBranch(data: number) {
    const branchValue = this.branchesNames.filter(obj => obj.id === data);
    if (branchValue.length > 0) {
      return this.branchesNames.filter(obj => obj.id === data)[0].name;
    } else {
      return '';
    }
  }

  public changeCollateralType(): void {
    this.collateralParameterService
      .queryFilterBy({
        collateralType: 'MACHINE',
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
