import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
  GEO_BOUNDARY_TYPE,
  POSITION_TYPE,
  APPLICATION_TYPE,
} from 'app/shared/constants/base.constants';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import moment from 'moment';
import lodash from 'lodash';
import { CollateralPropertyService } from '../collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { IPartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { PositionService } from 'app/entities/position/position.service';
import { InternalService } from 'app/entities/internal/internal.service';
import {
  FileManagerSettingsModel,
  HtmlEditorService,
  ImageService,
  LinkService,
  QuickToolbarSettingsModel,
  RichTextEditorComponent,
  ToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

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
  selector: 'jhi-collateral-property-personal-corporate-guarantee',
  templateUrl: './collateral-property-personal-corporate-guarantee.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
  ],
})
export class CollateralPropertyPersonalCorporateGuaranteeComponent implements OnChanges, OnInit {
  public tools: object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      '|',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      '|',
      'SubScript',
      'SuperScript',
      '|',
      'LowerCase',
      'UpperCase',
      '|',
      'Formats',
      'Alignments',
      '|',
      'OrderedList',
      'UnorderedList',
      '|',
      'Indent',
      'Outdent',
      '|',
      'CreateLink',
      'Image',
      '|',
      'ClearFormat',
      'Print',
      'SourceCode',
      '|',
      'FullScreen',
    ],
  };
  public iframe: object = { enable: true };
  public height = 500;

  public guaranteeClasification = [];
  public guaranteeIdentification = [];
  public managementBranchLov = [];
  public optionsCountry: IStateBoundary[];
  public optionsCountrySelected: IStateBoundary;
  public adress: IPartyPostalAddress;
  public partyCif: IPartyCif;
  private _collateralProperty: ICollateralProperty;
  private _collateralPropertyExternal: ICollateralProperty;
  private _collateral: ICollateral;
  guaranteeType: any;
  debitBlock: any;
  public branchesNames: any;
  public logoCcy = { prefix: '', thousands: ',', decimal: '.', precision: 0 };

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

  public myControlCurrency = new FormControl();
  public optionsCurrency: IUom[];
  public filteredOptionsCurrency: Observable<IUom[]>;
  public amountCcy: IUom;

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

  public textArea: HTMLElement;
  public myCodeMirror: any;

  public currency: number;
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
  public certypicateTypeLov: any;

  public guarantorName: string;
  public creditRating: string;
  public creditRatingDate: Date;
  public guarantorCountryId: string;

  constructor(
    private uomService: UomService,
    protected partyCifService: PartyCifService,
    public collateralPropertyService: CollateralPropertyService,
    public creditProposalService: CreditProposalService,
    public stateBoundaryService: StateBoundaryService,
    protected generalParameterService: GeneralParameterService,
    protected positionService: PositionService,
    private internalService: InternalService
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
    this.loadCurrencyMeasure();
    this.cekData();
    this.getLovGuarantee();
    this.getLovGuaranteeIdentification();
    this.initializeCountry();
    this.getLovManagementBranch();
    this.getLovCertificateType();
    console.log('collateral ', this.collateralProperty.marketValue);
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

  private _filterCurrency(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsCurrency.filter(option => option.description.toLowerCase().includes(filterValue));
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

  displayFnCurrency(curency: IUom): string {
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
        this.optionsMVOri = res.body;
        this.filteredMVOri();
        this.MVOriCcy = this.optionsMVOri.find(obj => obj.id === this.collateralProperty.marketValueOriginalCcy);
      });
  }

  public dataSource() {
    if (this.collateral.dataSource === 'h' || this.collateral.dataSource === 'H') {
      return true;
    }
    return false;
  }

  public setManagementBrance() {
    this.partyCifService.getManagementBranc().subscribe(res => {
      this.branceManagement = res.body;
    });
  }

  public setBranches() {
    this.partyCifService.geBranches().subscribe(res => {
      this.branchesNames = res.body;
      console.log('branch ', this.branchesNames);
    });
  }

  public getMVOriCcy() {
    this.collateralProperty.marketValueOriginalCcy = this.MVOriCcy.id;
    const setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService
      .getCurrency(this.collateralProperty.marketValueOriginalCcy, 'IDR', setDate.replace(/-/g, ''))
      .subscribe(res => {
        if (res.body[0]?.factor !== undefined) {
          this.currency = Number(res.body[0]?.factor);
          console.log('currency ', this.currency);
          this.collateralProperty.liquidationValue = this.collateralProperty.marketValueOriginalAmt * this.currency;
          this.collateralProperty.marketValue = this.collateralProperty.marketValueOriginalAmt * this.currency;
        } else {
          this.currency = 0;
          this.collateralProperty.liquidationValue = this.collateralProperty.marketValueOriginalAmt * this.currency;
          this.collateralProperty.marketValue = this.collateralProperty.marketValueOriginalAmt * this.currency;
        }
      });
  }

  public setData() {
    this.collateralProperty.liquidationValue = this.collateralProperty.marketValueOriginalAmt;
    this.collateralProperty.marketValue = this.collateralProperty.marketValueOriginalAmt;
  }

  public amountChange() {
    console.log('change');
    this.collateralProperty.liquidationValue = this.collateralProperty.marketValueOriginalAmt * this.currency;
    this.collateralProperty.marketValue = this.collateralProperty.marketValueOriginalAmt * this.currency;
  }

  public findCif() {
    console.log('cif ', this.collateralProperty.guarantorCif);
    if (this.collateralProperty.guarantorCif !== null) {
      this.partyCifService.findCifCash(this.collateralProperty.guarantorCif).subscribe(res => {
        console.log('res body ', res.body);
        this.partyCif = res.body;
        if (this.partyCif) {
          this.guarantorName = this.partyCif.name;
          this.creditRating = this.partyCif.creditRatings[0].creditRating;
          this.creditRatingDate = this.partyCif.creditRatings[0].ratingDate;
          this.adress = this.partyCif.addresses.find(obj => obj.purposeTypeId === 'PRIMARY_LOCATION');
          if (this.adress) {
            console.log('adress ', this.adress);
            this.findCountryName(this.adress.address.countryId);
          }
        }
      });
    }
  }

  public initializeCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.optionsCountry = res.body;
        this.findCif();
      });
  }

  public findCountryName(id: number) {
    if (this.optionsCountry) {
      this.optionsCountrySelected = this.optionsCountry.find(obj => obj.id === id);
      console.log('option country ', this.optionsCountry);
      console.log('country ', id);
      if (this.optionsCountrySelected) {
        this.guarantorCountryId = this.optionsCountrySelected.description;
      }
    }
  }

  public getLovGuarantee() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'GUARANTEE_CLASSIFICATION',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.guaranteeClasification = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public getLovGuaranteeIdentification() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'GUARANTEE_IDENTIFICATION_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        console.log('ini res ', res);
        this.guaranteeIdentification = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public getLovManagementBranch() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'MANAGEMENT_BRANCH',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        console.log('ini res ', res);
        this.managementBranchLov = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public getLovCertificateType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'CERTIFICATE_TYPE_CGPG',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        console.log('ini res certificate type', res.body);
        console.log('ini id certificate type ', this.collateralProperty.attributes.certificateType);
        this.certypicateTypeLov = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  print() {
    console.log('collateral property', this.collateralProperty);
  }
}
