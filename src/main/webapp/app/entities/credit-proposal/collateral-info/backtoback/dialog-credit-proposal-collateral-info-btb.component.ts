import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from '../../credit-proposal.model';
import { ICreditProposalCollateralBinding } from '../credit-proposal-collateral-info.model';
import { IEmptyField } from './empty-field.model';
import { Observable, of } from 'rxjs';
import lodash from 'lodash';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { PARIPASU_STATUS, STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_TYPE, OTHER_COLLATERAL_DETAIL_TYPE } from 'app/shared/constants/base.constants';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { TemplateService } from 'app/layouts/template/template.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  templateUrl: './dialog-credit-proposal-collateral-info-btb.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
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
export class DialogCreditProposalCollateralInfoDialogBTBComponent implements OnInit {
  private bindingStart: ICreditProposalCollateralBinding;
  private emptyStart: IEmptyField;
  public collateralStartState: ICollateral;

  public logoIdr = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  public cursIdr: number;
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
  public logoCcy;

  private branceManagement: any;
  public branchesNames: any;
  public collateralCode: any;
  public collateralDetails: object[];
  private dataBranch: any;
  private dataBranchName: any;
  public branch: string;
  public collateral: ICollateral;
  public creditProposal: ICreditProposal;
  public creditProposalOpenState: ICreditProposal;
  public binding: ICreditProposalCollateralBinding;
  public empty: IEmptyField;
  private bindingTypeVal: any;
  public properties: ICollateralProperty[];
  public filteredOptionBindingTypes: Observable<string[]>;
  public collateralProperty: ICollateralProperty;
  public collateralPropertyExternal: ICollateralProperty;
  public collateralDetailType: any;
  public depositInterestRate: number;
  public selectedMenu: string;
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
  public collateralStatus: any;
  public paripasuStatus: any;
  public bindingTypes = [];
  public isViewMode: Boolean;

  public collateralValue: number;
  public accountCustomer: any;
  public lembagaPenjamin: string;
  public sifatJaminan: string;
  public noDocumentJaminan: string;
  public jenis: string;
  public parentSource = '';
  public field = false;
  public parentPath = this.router.url.split('/')[1];
  public fields = false;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralPropertyService: CollateralPropertyService,
    private partyCifService: PartyCifService,
    private cashCollateralService: CashCollateralService,
    protected generalParameterService: GeneralParameterService,
    private _dialog: MatDialogRef<DialogCreditProposalCollateralInfoDialogBTBComponent>,
    private templateService: TemplateService,
    protected activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
      properties: ICollateralProperty[];
      binding: ICreditProposalCollateralBinding;
      emptyField: IEmptyField;
      isViewMode: Boolean;
      parentSource: string;
      depositInterestRate: number;
    }
  ) {
    this.parentSource = this.data.parentSource;
    this.creditProposal = this.data.cp;
    this.creditProposalOpenState = lodash.cloneDeep(this.data.cp);
    this.collateral = this.data.collateral;
    this.binding = this.data.binding;
    this.bindingStart = lodash.cloneDeep(this.binding);
    this.properties = this.data.properties;
    this.empty = this.data.emptyField;
    this.emptyStart = lodash.cloneDeep(this.empty);
    this.collateralStatus = STATUS_COLLATERAL;
    this.paripasuStatus = PARIPASU_STATUS;
    // this.bindingTypes = COLLATERAL_BINDING_TYPE;
    this.collateralDetailType = OTHER_COLLATERAL_DETAIL_TYPE;
    this.isViewMode = this.data.isViewMode;
    this.setManagementBrance();
    this.setBranches();
    this.loadByCollateral(this.collateral.id);
    this.depositInterestRate = data.depositInterestRate;
    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
  }
  ngOnInit(): void {
    this.getRole();
    this.loadCollateralDetailOption().then(resolve => {
      this.setCollateralDetail();
    });
    this.setBranches();
    this.lovBindingType();
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
      this.parentPath === 'review-dppk' ||
      this.parentPath === 'loan-ops-distribution' ||
      this.parentPath === 'loan-ops-review'
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

  moment = _rollupMoment || _moment;
  date = new FormControl(moment());

  public filterBindingType(): void {
    const text: string = this.binding.bindingType;

    const regex = new RegExp(`\\b${text}`, 'i');
    const filtered: any = this.optionBindingTypes.filter(n => regex.test(n));

    this.filteredOptionBindingTypes = of(filtered);
  }
  public lovBindingType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_BINDING_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.bindingTypes = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public save() {
    if (!this.binding.collateralId) {
      this.binding.collateralId = this.collateral.id;
    }

    if (!this.empty.collateralId) {
      this.empty.collateralId = this.collateral.id;
    }

    this._dialog.close({
      collateral: this.collateral,
      binding: this.binding,
      emptyField: this.empty,
      creditProposal: this.creditProposal,
      depositInterestRate: this.depositInterestRate,
    });
  }

  public cancel() {
    this._dialog.close();
  }

  public getCreditProposalMappingData(creditProposalMappingData: any): void {
    this.creditProposal = creditProposalMappingData;
  }
  public getCertificateDueDate(): string {
    return this.creditProposalService.getCertificationDate(this.collateral, this.properties);
  }

  private loadByCollateral(collateralId: number): void {
    this.collateralPropertyService
      .queryFilterBy({
        page: 0,
        idCollateral: collateralId,
        idPropertyType: CollateralPropertyType.GENERAL,
        size: 9999,
      })
      .subscribe(res => {
        if (res.body.length > 0) {
          this.collateralProperty = lodash.find(res.body, function (o) {
            return !o.external;
          });
          this.collateralPropertyExternal = lodash.find(res.body, function (o) {
            return o.external;
          });
          this.setValue();
        }
      });
  }

  public setValue() {
    console.log('ini collateral ', this.collateralProperty);
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
      this.noDocumentJaminan = this.collateralProperty.attributes.certificateNumber;
      this.collateralValue = this.collateralProperty.attributes.amount;
      this.accountCustomer = this.collateralProperty.attributes.lGApp;
      this.lembagaPenjamin = this.collateralProperty.attributes.issuingInstitusi;
      this.jenis = this.collateral.attributes['collateralCode'];
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      this.collateralValue = this.collateralProperty.attributes.amount;
      this.lembagaPenjamin = this.collateralProperty.attributes.bicCode;
      this.noDocumentJaminan = this.collateralProperty.attributes.accountNumber;
      this.accountCustomer = this.collateralProperty.attributes.accountCustomerNo;
      this.jenis = this.collateral.attributes['collateralCode'];
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['securities']) {
      this.collateralValue = this.collateralProperty.attributes.totalFaceAmount;
      this.accountCustomer = this.collateralProperty.attributes.securityName;
      this.lembagaPenjamin = this.collateralProperty.attributes.issuer;
      this.jenis = this.collateral.attributes['collateralCode'];
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['other']) {
      this.jenis = this.collateralProperty.attributes.collateralDetailType;
      this.collateralValue = this.collateralProperty.attributes.marketValue;
      this.sifatJaminan = this.collateralProperty.attributes.issuer;
    }
  }

  public getBindingType(element: string) {
    if (this.bindingTypeVal) {
      const data = this.bindingTypeVal.find(obj => obj.code === element);
      if (data) {
        return data.value;
      }
    }
    return '';
    // const keyy = Object.keys(this.bindingTypeVal).find(item => item === element);
    // return this.bindingTypeVal[keyy];
  }

  public print() {
    console.log(this.creditProposal);
  }

  public setManagementBrance() {
    this.partyCifService.getManagementBranc().subscribe(res => {
      this.branceManagement = res.body;
      this.branch = this.findBranchName(this.collateralProperty.attributes.branch);
    });
  }

  public setBranches() {
    this.partyCifService.geBranches().subscribe(res => {
      this.branchesNames = res.body;
    });
  }

  private setCollateralDetail(): void {
    if (this.collateral.id) {
      const collateral = this.collateral;
      this.collateralCode = lodash.find(this.collateralDetails, function (o) {
        return o['id'] === collateral.collateralTypeId;
      })['child'];
    }
  }

  private loadCollateralDetailOption(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.cashCollateralService.loadDetailType().subscribe(res => {
        this.collateralDetails = res.body;
        resolve();
      });
    });
  }

  public findBranch(id) {
    if (this.branceManagement) {
      this.dataBranch = this.branceManagement.find(obj => obj.id === id);
      if (this.dataBranch) {
        return this.branceManagement.label;
      }
      return '';
    }
  }

  public findBranchName(id) {
    console.log('ini branch name', this.branchesNames);
    for (let i = 0; i < this.branchesNames.length; i++) {
      console.log('id branch', this.branchesNames[i]);
    }
    console.log('ini id', id);
    if (this.branchesNames) {
      this.dataBranchName = this.branchesNames.find(obj => obj.id === id);
      if (this.dataBranchName) {
        return this.branchesNames.label;
      }
      return '';
    }
  }

  public getCurrency() {
    let data: ICollateralProperty;
    if (this.collateral) {
      data = this.properties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === this.collateral.id && obj.external === false
      );
      if (data) {
        if (data.marketValueOriginalCcy === undefined || data.marketValueOriginalCcy === null) {
          return '';
        }
        return data.marketValueOriginalCcy;
      }
    }
    return 'IDR';
  }

  public countMVOriginal() {
    let result: string;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    // console.log("collateral in above grid",collateral);
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      data = this.properties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === this.collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.amount === null || data.attributes.amount === undefined) {
          return 0;
        } else {
          return data.attributes.amount;
        }
      }
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['personalProperty']) {
      data = this.properties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === this.collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.collateralValue === null || data.attributes.collateralValue === undefined) {
          return 0;
        } else {
          return data.attributes.collateralValue;
        }
      }
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['securities']) {
      data = this.properties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === this.collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.totalFaceAmount === null || data.attributes.totalFaceAmount === undefined) {
          return 0;
        } else {
          return data.attributes.totalFaceAmount;
        }
      }
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['other']) {
      data = this.properties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === this.collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.collateralValueOther === undefined || data.attributes.collateralValueOther === null) {
          return 0;
        } else {
          return data.attributes.collateralValueOther;
        }
      }
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
      data = this.properties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === this.collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.amount === null || data.attributes.amount === undefined) {
          return 0;
        } else {
          return data.attributes.amount;
        }
      }
    }
    if (
      this.collateral.collateralTypeId === COLLATERAL_TYPE['machine'] ||
      this.collateral.collateralTypeId === COLLATERAL_TYPE['vehicle'] ||
      this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate']
    ) {
      data = this.properties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === this.collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketValueOriginalAmt === null) {
          return 0;
        } else {
          return data.marketValueOriginalAmt;
        }
      }
    }
    return 0;
  }
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
        this._dialog.close();
      }
    });
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

  public showFieldDepositInterestRate() {
    if (this.collateral.collateralTypeId === 'DEPOSIT') {
      return true;
    }
    return false;
  }

  public disableDepositInterestRate() {
    if (this.parentPath === 'finalize-dppk' && this.selectedMenu === 'collateral-info') {
      return false;
    }
    return true;
  }
}
