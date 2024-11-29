import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import {
  COLLATERAL_DEPOSIT_DEBIT_BLOCK,
  GUARANTEE_TYPE,
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
import { firstValueFrom, map, Observable, startWith, Subscriber } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import moment from 'moment';
import lodash, { size } from 'lodash';
import { CollateralPropertyService } from '../collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { CollateralParameterService } from 'app/entities/master-parameter/collateral-parameter/collateral-parameter.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY/MM/DD',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY/MM/DD',
  },
};
@Component({
  selector: 'jhi-collateral-property-realestate-dialog',
  templateUrl: './collateral-property-realestate-dialog.component.html',
  styleUrls: ['./collateral-property-realestate-dialog.style.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CollateralPropertyRealestateDialogComponent implements OnInit, OnChanges {
  private _collateralProperty: ICollateralProperty;
  private _collateralPropertyExternal: ICollateralProperty;
  private _collateral: ICollateral;
  guaranteeType: any;
  debitBlock: any;
  public branchesNames: any;
  public logoCcy = { prefix: '', thousands: ',', decimal: '.', precision: 0 };

  public myControlMVImb = new FormControl();
  public optionsMVImb: IUom[];
  public filteredOptionsMVImb: Observable<IUom[]>;
  public MVImbCcy: IUom;

  public myControlMVPs = new FormControl();
  public optionsMVPs: IUom[];
  public filteredOptionsMVPs: Observable<IUom[]>;
  public MVPsCcy: IUom;

  public myControlMVEx = new FormControl();
  public optionsMVEx: IUom[];
  public filteredOptionsMVEx: Observable<IUom[]>;
  public MVExCcy: IUom;

  public myControlMVTk = new FormControl();
  public optionsMVTk: IUom[];
  public filteredOptionsMVTk: Observable<IUom[]>;
  public collPropLand: ICollateralProperty[];
  public collPropBuilding: ICollateralProperty[];
  public liquidationValueMV: number;
  public MVTkCcy: IUom;

  public myControlMVOri = new FormControl();
  public optionsMVOri: IUom[];
  public filteredOptionsMVOri: Observable<IUom[]>;
  public MVOriCcy: IUom;
  public NjopCcy: IUom;
  public myControlNjop = new FormControl();

  moment = _rollupMoment || moment;
  date = new FormControl(moment());

  @Input() public officerName: any;
  @Input() public branchId: any;

  @Input()
  get collateralPropertyExternal() {
    return this._collateralPropertyExternal;
  }

  set collateralPropertyExternal(param: ICollateralProperty) {
    this._collateralPropertyExternal = param;
  }
  private _pariPasu: string;
  @Input()
  get pariPasu() {
    return this._pariPasu;
  }
  set pariPasu(data: string) {
    this._pariPasu = data;
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
  public certificateType = [];
  public managementBranch: any;
  public provinces: IStateBoundary[];
  public cities: IStateBoundary[];
  public districts: IStateBoundary[];
  public villages: IStateBoundary[];
  public detailType: any;
  public branceManagement: any;
  public collateralDetailTypeValue: string;

  constructor(
    private uomService: UomService,
    protected partyCifService: PartyCifService,
    protected generalParameterService: GeneralParameterService,
    protected collateralParameterService: CollateralParameterService,
    public collateralPropertyService: CollateralPropertyService
  ) {
    // this.certificateType = REALESTATE_CERTIFICATE_TYPE;
    this.managementBranch = SECURITIES_MANAGEMENT_BRANCH;
    this.guaranteeType = GUARANTEE_TYPE;
    this.debitBlock = COLLATERAL_DEPOSIT_DEBIT_BLOCK;
    this.collateralDetailType = REALESTATE_COLLATERAL_DETAIL_TYPE;
    this.collPropLand = [];
    this.collPropBuilding = [];
    this.liquidationValueMV = 0;
  }
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['collateral']) {
      await this.loadCollateralProperty(this.collateral.id);
      this.setLiquidationValueMV();
    }
  }

  ngOnInit(): void {
    this.detailTypeChange(this.collateral.collateralTypeId);
    this.loadCurrencyMeasure();
    this.loadAreaMeasure();
    this.collateral.collateralTypeId;
    // this.setCertyficateType();
    this.setManagementBrance();
    this.setBranches();
    this.cekDataSource();
    this.cekData();
    this.lovcertificateType();
    this.changeCollateralType();
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

  private async loadCollateralProperty(collateralId: number): Promise<void> {
    const collProp: ICollateralProperty[] = (
      await firstValueFrom(this.collateralPropertyService.queryFilterBy({ idCollateral: collateralId, size: 9999, page: 0 }))
    ).body;
    if (collProp.length > 0) {
      this.collPropBuilding = lodash.filter(collProp, function (o) {
        return o.propertyType === CollateralPropertyType.BUILDING;
      });

      this.collPropLand = lodash.filter(collProp, function (o) {
        return o.propertyType === CollateralPropertyType.LAND;
      });
    }
  }

  private setLiquidationValueMV(): void {
    this.liquidationValueMV = this.collateralPropertyService.countRealEstateLiquidationMarketValueRounding(
      this.collPropLand,
      this.collPropBuilding
    );
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

  filteredMVPs() {
    this.filteredOptionsMVPs = this.myControlMVPs.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVPs(name as string) : this.optionsMVPs.slice();
      })
    );
  }

  displayFnMVPs(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filterMVPs(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsMVPs.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  filteredMVEx() {
    this.filteredOptionsMVEx = this.myControlMVEx.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVEx(name as string) : this.optionsMVEx.slice();
      })
    );
  }

  displayFnMVEx(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filterMVEx(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsMVEx.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  filteredMVTk() {
    this.filteredOptionsMVTk = this.myControlMVTk.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVTk(name as string) : this.optionsMVTk.slice();
      })
    );
  }

  displayFnMVTk(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  private _filterMVTk(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsMVTk.filter(option => option.description.toLowerCase().includes(filterValue));
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

  displayFnMVOri(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
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
        this.optionsMVImb = res.body;
        this.filteredMVImb();
        this.MVImbCcy = this.optionsMVImb.find(obj => obj.id === this.collateralProperty.attributes.marketValueImbCcy);
        this.optionsMVPs = res.body;
        this.filteredMVPs();
        this.MVPsCcy = this.optionsMVPs.find(obj => obj.id === this.collateralProperty.attributes.marketValueCcy);
        this.optionsMVEx = res.body;
        this.filteredMVEx();
        this.MVExCcy = this.optionsMVEx.find(obj => obj.id === this.collateralPropertyExternal.attributes.marketValueCcy);
        this.optionsMVTk = res.body;
        this.filteredMVTk();
        this.MVTkCcy = this.optionsMVTk.find(obj => obj.id === this.collateralProperty.attributes.marketValueTkCcy);
        this.optionsMVOri = res.body;
        this.filteredMVOri();
        this.MVOriCcy = this.optionsMVOri.find(obj => obj.id === this.collateralProperty.marketValueOriginalCcy);
        this.filteredNjop();
        this.NjopCcy = this.optionsMVOri.find(obj => obj.id === this.collateralProperty.marketValueNjopCcy);
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
    this.myControlMVImb.disable();
    this.myControlMVEx.disable();
    this.myControlMVPs.disable();
    this.myControlMVTk.disable();
    this.myControlMVOri.disable();
    this.collateralProperty.attributes.marketValueCcy = 'IDR';
    this.collateralProperty.attributes.marketValueImbCcy = 'IDR';
    this.collateralPropertyExternal.attributes.marketValueCcy = 'IDR';
    this.collateralProperty.attributes.marketValueTkCcy = 'IDR';
  }

  public setManagementBrance() {
    // this.partyCifService.getManagementBranc().subscribe(res => {
    //   this.branceManagement = res.body;
    //   console.log('x10', this.branceManagement);
    // });
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'MANAGEMENT_BRANCH',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.branceManagement = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public setBranches() {
    this.partyCifService.geBranches().subscribe(res => {
      this.branchesNames = res.body;
    });
  }

  // public setCertyficateType() {
  //   this.partyCifService.getCertificate().subscribe(res => {
  //     this.certificateType = res.body;
  //   });
  // }

  public getMVImbCcy() {
    this.collateralProperty.attributes.marketValueImbCcy = this.MVImbCcy.id;
  }

  public getMVPsCcy() {
    this.collateralProperty.attributes.marketValueCcy = this.MVPsCcy.id;
  }

  public getMVExCcy() {
    this.collateralPropertyExternal.attributes.marketValueCcy = this.MVExCcy.id;
  }

  public getMVTkCcy() {
    console.log('this.mk tk', this.MVTkCcy);
    this.collateralProperty.attributes.marketValueTkCcy = this.MVTkCcy.id;
  }

  public getMVOriCcy() {
    this.collateralProperty.marketValueOriginalCcy = this.MVOriCcy.id;
  }

  public getNjopCcy() {
    this.collateralProperty.marketValueNjopCcy = this.NjopCcy.id;
  }

  filteredNjop() {
    this.filteredOptionsMVOri = this.myControlNjop.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVOri(name as string) : this.optionsMVOri.slice();
      })
    );
  }

  displayFnNjop(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }

  // Get Collateral Detail Type in Master Collateral
  public changeCollateralType(): void {
    this.collateralParameterService
      .queryFilterBy({
        collateralType: 'REALESTATE',
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
