import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { Observable, of } from 'rxjs';
import { ICreditProposalCollateralBinding, ICreditProposalCollateralInsurance } from '../credit-proposal-collateral-info.model';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_FACILITY_TYPE, COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { OptionNode } from 'app/shared/model/option-node.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { PARIPASU_STATUS, STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { Page } from '@syncfusion/ej2-angular-grids';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { TemplateService } from 'app/layouts/template/template.service';
import { Router } from '@angular/router';

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
  selector: 'jhi-credit-proposal-collateral-info-dialog',
  templateUrl: './credit-proposal-collateral-info-dialog.component.html',
  styleUrls: ['./collateral-info-dialog.css'],
  providers: [
    ToolbarService,
    HtmlEditorService,

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreditProposalCollateralInfoDialogComponent implements OnInit {
  private insuranceStart: ICreditProposalCollateralInsurance;
  private collateralStart: ICollateral;
  private bindingStart: ICreditProposalCollateralBinding;
  private _group: string;

  @Input()
  get group() {
    return this._group;
  }
  set group(data: string) {
    this._group = data;
  }

  public logoIdr = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  public cursIdr: number;
  logoCcy = {};
  public conCcy = false;
  public status = false;
  public unComitted = true;
  public com = true;
  public uncom = false;
  private creditProposalData: ICreditProposal;
  selection = true;
  public setDate: string;
  public preCurent = '';
  public currencyName: number;
  public ccy: string;
  public collateralProperties: ICollateralProperty[];
  public collateralTypes: ICollateralType[];
  public collateralCode: any;
  public collateralGrading = [];
  public collateralDetails: object[];
  public bindingTypesHobies = [];
  public facilityTypes: any;
  public creditProposal: ICreditProposal;
  public creditProposalOpenState: ICreditProposal;
  public disabledOpt = true;
  public collateral: ICollateral;
  public insurance: ICreditProposalCollateralInsurance;
  public marketability: string;
  public internalMV: number;
  public internalLV: number;
  public kjjpMV: number;
  public kjjpLV: number;
  public properties: ICollateralProperty[];
  public filteredOptionBindingTypes: Observable<string[]>;
  public binding: ICreditProposalCollateralBinding;
  public lovRank = [];
  public paripasuStatus: any;
  public dataCertDueDate: any;
  public dataOwnerShip: string;
  public matrikBindingType;
  public facilityTypeMatrik: any;
  public collateralCodeMatrik: any;
  public isViewMode: Boolean;
  public optionBindingTypes: string[] = [
    'HAK TANGGUNGAN (APHT)',
    'GADAI',
    'FEO',
    'SKMHT',
    'CESSIE',
    'HIPOTIK',
    'PERNYATAAN JAMINAN & KUASA',
    'BELUM DIIKAT',
    'LAINNYA',
  ];
  public optionCcy: string[] = ['IDR', 'USD'];
  public lovCollateralStatus: any;
  public insuranceTypes = [];
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());
  public collateralGradings: string;
  public parentSource = '';
  public field = false;
  public parentPath = this.router.url.split('/')[1];
  public fields = false;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralTypeService: CollateralTypeService,
    private cashCollateralService: CashCollateralService,
    protected generalParameterService: GeneralParameterService,
    private _dialog: MatDialogRef<CreditProposalCollateralInfoDialogComponent>,
    private templateService: TemplateService,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
      marketability: string;
      internalMV: number;
      internalLV: number;
      externalMV: number;
      externalLV: number;
      properties: ICollateralProperty[];
      binding: ICreditProposalCollateralBinding;
      insurance: ICreditProposalCollateralInsurance;
      certDueDate: any;
      ownerShip: string;
      matrikBindingType: string;
      isViewMode: boolean;
      group: string;
      collateralProperties: ICollateralProperty[];
      parentSource: string;
    }
  ) {
    this.facilityTypes = COLLATERAL_FACILITY_TYPE;
    this.creditProposal = this.data.cp;
    this.creditProposalOpenState = lodash.cloneDeep(this.data.cp);
    this.collateral = this.data.collateral;
    this.collateralStart = lodash.cloneDeep(this.collateral);
    this.marketability = this.data.marketability;
    this.internalMV = this.data.internalMV;
    this.internalLV = this.data.internalLV;
    this.kjjpMV = this.data.externalMV;
    this.kjjpLV = this.data.externalLV;
    this.properties = this.data.properties;
    this.binding = this.data.binding;
    this.bindingStart = lodash.cloneDeep(this.binding);
    this.insurance = this.data.insurance;
    this.insuranceStart = lodash.cloneDeep(this.insurance);
    this.matrikBindingType = this.data.matrikBindingType;
    this.lovCollateralStatus = STATUS_COLLATERAL;
    this.paripasuStatus = PARIPASU_STATUS;
    this.dataCertDueDate = data.certDueDate;
    this.dataOwnerShip = data.ownerShip;
    this.isViewMode = data.isViewMode;
    this.collateralProperties = data.collateralProperties;
    this.group = data.group;
    this.parentSource = data.parentSource;
  }

  ngOnInit(): void {
    this.getRole();
    this.loadCollateralDetailOption().then(resolve => {
      this.setCollateralDetail();
    });
    this.loadCollateralType();
    this.loadCollateralGrading();
    this.trashUndefined();
    this.checkStatusCOllateral();
    this.getFacilityType();
    this.lovBindingType();
    this.lovInsuranceTypes();
    this.addLovRank();
    this.cekCurrency();
    this.disableField();
    this.disableFields();
  }
  public disableField() {
    if (
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      // this.parentPath === 'dar-revision' ||
      this.parentPath === 'dar-revision-checker' ||
      this.parentPath === 'finalize-dppk' ||
      this.parentPath === 'review-dppk'
    ) {
      // Default Disabled
      this.field = true;
    }
  }
  public disableFields() {
    if (
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'dar-revision' ||
      this.parentPath === 'dar-revision-checker' ||
      this.parentPath === 'finalize-dppk' ||
      this.parentPath === 'review-dppk'
    ) {
      // Default Disabled
      this.fields = true;
    }
  }
  public hiddenPath() {
    if (this.parentPath !== 'finalize') {
      return true;
    }
    return false;
  }
  public getRole() {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.checkRole(newPos.positionTypeId);
    });
  }

  public checkRole(param): void {
    if (param === 'RM') {
      this._dialog.disableClose = true;
      this._dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
  }

  public lovInsuranceTypes() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSURANCE_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        console.log('insurance type body ', res.body);
        this.insuranceTypes = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public lovBindingType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_BINDING_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.bindingTypesHobies = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public addLovRank() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RANK',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.lovRank = lodash.filter(res.body, o => o.statusId === 'ACTIVE');
        this.lovRank.sort((a, b) => a.code - b.code);
      });
  }

  public getFacilityType() {
    const keyy = Object.keys(this.facilityTypes).find(item => item === this.collateral.facilityType);
    return this.facilityTypes[keyy];
  }

  public getCollateralCode() {
    const data = this.collateralCode.find(obj => obj.id === this.collateral.attributes.collateralCode);
    if (data) {
      this.collateralCodeMatrik = data.description;
    }
  }

  private loadCollateralGrading(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_GRADING',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralGrading = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.collateralGrading.length; i++) {
          if (this.collateralGrading[i].code === this.collateral.collateralGrading) {
            this.collateralGradings = this.collateralGrading[i].value;
          }
        }
      });
  }

  private loadCollateralDetailOption(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.cashCollateralService.loadDetailType().subscribe(res => {
        this.collateralDetails = res.body;
        resolve();
      });
    });
  }

  private setCollateralDetail(): void {
    if (this.collateral.id) {
      const collateral = this.collateral;
      this.collateralCode = lodash.find(this.collateralDetails, function (o) {
        return o['id'] === collateral.collateralTypeId;
      })['child'];

      this.getCollateralCode();
    }
  }

  private loadCollateralType(): void {
    this.collateralTypeService.query().subscribe(res => {
      this.collateralTypes = res.body;
    });
  }

  public save() {
    console.log('ini insurance ', this.insurance);
    if (!this.binding.collateralId) {
      this.binding.collateralId = this.collateral.id;
    }
    if (!this.insurance.collateralId) {
      this.insurance.collateralId = this.collateral.id;
    }
    this._dialog.close({
      binding: this.binding,
      collateral: this.collateral,
      insurance: this.insurance,
      creditProposal: this.creditProposal,
    });
  }

  // public cancel() {
  //   this._dialog.close({
  //     creditProposal: this.creditProposalOpenState,
  //   });
  // }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close({
          creditProposal: this.creditProposalOpenState,
        });
      }
    });
  }

  public getCertificateDueDate(): string {
    return this.creditProposalService.getCertificationDate(this.collateral, this.properties);
  }

  public filterBindingType(): void {
    const text: string = this.binding.bindingType;

    const regex = new RegExp(`\\b${text}`, 'i');
    const filtered: any = this.optionBindingTypes.filter(n => regex.test(n));

    this.filteredOptionBindingTypes = of(filtered);
  }

  public getCreditProposalMappingData(creditProposalMappingData: any): void {
    this.creditProposal = creditProposalMappingData;
  }

  public dataSource() {
    if (this.collateral.dataSource === 'h' || this.collateral.dataSource === 'H') {
      return true;
    }
    return false;
  }
  public trashUndefined() {
    if (this.marketability === undefined && this.marketability === 'undefined') {
      this.marketability = '';
    }
  }

  public checkStatusCOllateral() {
    if (this.collateral.paripasuStatus === undefined) {
      this.collateral.paripasuStatus = 'N';
    }
  }

  public getCollateralStatus(element) {
    if (element.paripasuStatus === 'Y' || element.paripasuStatus === 'y') {
      return 'YES';
    } else if (element.paripasuStatus === 'N' || element.paripasuStatus === 'n') {
      return 'NO';
    }
    return '';
  }

  public changeDataMV() {
    this.internalLV = this.countMV(this.collateral);
  }

  public countMV(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketValue === null) {
          return 0;
        } else {
          return data.marketValue;
        }
      }
    }
    return 0;
  }

  changeCurrency(value: string) {
    this.ccy = value;
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency(value, 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyName = res.body[0]?.factor;
      this.binding.kurs = res.body[0]?.factor;
      if (this.preCurent === '') {
        if (value === 'IDR') {
          this.conCcy = true;
          this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
          this.preCurent = 'IDR';
        } else if (value === 'USD') {
          this.conCcy = true;
          this.logoCcy = {};
          this.preCurent = 'USD';
        }
      } else if (this.preCurent === 'IDR') {
        if (value === '') {
          this.conCcy = false;
          this.preCurent = '';
        } else if (value === 'USD') {
          this.conCcy = true;
          this.logoCcy = {};
          this.binding.bindingValueEqIdr = this.binding.bindingValueEqIdr / this.currencyName;
          this.preCurent = 'USD';
        }
      } else if (this.preCurent === 'USD') {
        if (value === '') {
          this.conCcy = false;
          this.preCurent = '';
        } else if (value === 'IDR') {
          this.conCcy = true;
          this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
          this.getCurs();
          this.preCurent = 'IDR';
        }
      }
    });
  }

  getCurs() {
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.cursIdr = res.body[0]?.factor;
      this.binding.bindingValueEqIdr = this.binding.bindingValueEqIdr * this.cursIdr;
    });
  }

  public calBindingValue() {
    const calculation = this.binding.bindingValue * this.binding.kurs;
    this.binding.bindingValueEqIdr = calculation;
    return calculation;
  }

  public cekCurrency() {
    if (this.binding.ccy === 'IDR') {
      this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
    }
    if (this.binding.ccy === 'USD') {
      this.logoCcy = {};
    }
  }
}
