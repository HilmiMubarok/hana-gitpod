import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationOptionService } from 'app/entities/application-option/application-option.service';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import lodash from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { IndexRateService } from '../../index-rate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { MasterProductParameterService } from 'app/entities/master-parameter/master-product/master-product-parameter.service';
import { IMasterProductParameter } from 'app/entities/master-parameter/master-product/master-product-parameter.model';
import { ProductClassificationService } from 'app/entities/product-classification/product-classification.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MessageService } from 'primeng/api';

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
  selector: 'jhi-loan-facility-dialog',
  templateUrl: './loan-facility-dialog.component.html',
  styleUrls: ['./dialog-facility.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreditProposalLoanFacilityDialogComponent extends AbstractEntityBaseViewComponent<ICreditProposal> implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  private _collateral: ICollateral;
  private _creditproposal: ICreditProposal;
  public dataItem: ICreditProposal;
  public indexRate: string;
  public ccy: string;
  public rateType: string;
  public dateIndex: number;
  public facilityType: string;
  public statusFacilityValue: string;
  public statusFacilityDisabled: boolean;
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());
  private listFacicility: any;
  private listLoanType: any;
  public listGeneralLov = [];
  public masterProduct: IMasterProductParameter;
  public listCategoryLov = [];
  public revolving: Boolean;
  public logoProvisonFee = {};
  public logoAdminFee = {};
  public dataTrhu: Date;

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  @Input()
  get creditProposal() {
    return this._creditproposal;
  }
  set creditProposal(param: ICreditProposal) {
    this._creditproposal = param;
  }

  public logoIdr = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  public othersDescStat: Boolean = true;
  public myControl = new FormControl('');
  public filteredOptions: Observable<string[]>;
  public disableButton = false;
  public logoCcy;
  public conCcy = false;
  public dateNow = new Date();
  public checked = false;
  public detailStats = false;
  public statIntRate = false;
  public lovSublimit = [];
  public disButtonSub = true;
  public labelSublimit = [];
  public lovIndex = [];
  private selectedType;
  private selectedCurrency;
  private provisionFormat = '0,.00';
  private adminFormat = '0,.00';

  public preCurent = '';
  public lovLoanType = [];
  public listOfValue = {
    applicationTypeList: [
      'New',
      'Additional / Top Up',
      'Renewal',
      'Restructure',
      'Existing',
      'Others',
      'Renewal + Additional',
      'Renewal + Decrease',
      'Decrease',
      'Renewal + Others',
      'Additional + Others',
      'Decrease + Others',
    ],
    facilityTypeList: ['OD', 'WCI', 'DL', 'MML', 'FL', 'TR', 'E-ARC', 'IL', 'BG', 'LC', 'FN - Syndicate loan / club deal'],
    installmentMethodList: [
      'Maturity Repayment',
      'Even Installment',
      'Even Installment(First Uneven)',
      'Even Installment(Last Uneven)',
      'Uneven Installment',
      'Annuity(All)',
      'Annuity(Partial)',
      'Annuity(All) In Advance',
    ],
    periodTypeList: ['Week', 'Month', 'Year'],
    sublimitFromExistingFacilityList: [],
    currencyList: ['IDR', 'USD'],
    restructList: [
      'Penurunan suku bunga kredit',
      'Perpanjangan jangka waktu kredit',
      'Pengurangan tunggakan pokok kredit',
      'Pengurangan tunggakan bunga kredit',
      'Penambahan fasilitas kredit',
      'Konversi kredit menjadi penyertaan modal sementara',
      'Penambahan fasilitas kredit dan pengurangan tunggakan bunga kredit',
      'Penambahan fasilitas kredit dan perpanjangan jangka waktu kredit',
      'Penambahan fasilitas kredit dan penurunan suku bunga kredit',
      'Penambahan fasilitas kredit, pengurungan tunggakan bunga kredit dan penurunan suku bunga kredit',
      'Penambahan fasilitas kredit, pengurangan tunggakan bunga kredit dan perpanjangan jangka waktu kredit',
      'Lainnya',
    ],
    lovWci: ['Working Capital - Installment', 'Working Capital - Installment ECL', 'Working Capital - Installment(Foreign)'],
    lovDl: [
      'Working Capital - Demand Loan',
      'Working Capital - Demand Loan ECL',
      'Working Capital - Trust Receipt',
      'Working Capital - ARC Loan',
      'Working Capital - eARC Loan',
      'Working Capital - Demand Loan(Foreign)',
      'Working Capital - Trust Receipt(Foreign)',
      'Working Capital - ARC Loan(Foreign)',
      'Working Capital - eARC Loan(Foreign)',
    ],
    lovMml: ['Working Capital - Money Market Line'],
    lovBg: [
      'Bank Guarantee Bid Bond',
      'Bank Guarantee Performance Bond',
      'Bank Guarantee Adnced Payment',
      'Bank Guarantee Shipping  Guarantee',
      'Bank Guarantee Standby L/C',
      'Bank Guarantee Endorsement A/Srt Bhrg',
      'Bank Guarantee Lainnya',
      'Bank Guarantee VA Bid Bond',
      'Bank Guarantee VA Performance Bond',
      'Bank Guarantee VA Advanced Payment',
      'Bank Guarantee VA Shipping  Guarantee',
      'Bank Guarantee VA Standby L/C',
      'Bank Guarantee VA Endorsement A/Srt Bhrg',
      'Bank Guarantee VA Lainnya',
    ],
    lovfL: [
      'Working Capital - Fixed Loan',
      'Working Capital - Fixed Loan ECL',
      'Working Capital - Fixed Loan(Foreign)',
      'Investment Loan - Fixed Loan',
      'Investment Loan - Fixed Loan(Foreign)',
    ],
    lovIl: [
      'Investment Loan - Installment',
      'Investment Loan - Installment ECL',
      'Investment Loan - Installment(Foreign)',
      'Long Term Loan (SYNDICATED LOAN) -- Menu FN11',
    ],
    lovLc: [
      '*Product refer to treasury menu (FORWARD)',
      '*Product refer to trade finance menu (for L/C Import)',
      '*Product refer to trade finance menu (for L/C Export)',
    ],
    lovOd: [
      'CURRENT DEPOSITS',
      'CURRENT DEPOSITS SUPER GIRO',
      'HANA READY CASH',
      'READY CASH PACKAGE 1',
      'PREMIUM ACCOUNT',
      'FLEXI MULTIPURPOSE',
      'CURRENT DEPOSITS SPECIAL SUPER GIRO',
      'CURRENT DEPOSITS SPECIAL SUPER GIRO II',
      'CURRENT DEPOSITS (OTHER)',
      'CURRENT DEPOSITS (OTHER) - MULTICURRENCY',
      'CURRENT DEPOSITS (Foreign)',
      'CURRENT DEPOSITS SUPER GIRO (USD)',
      'CURRENT DEPOSITS SPECIAL SUPER GIRO (USD)',
      'Kredit Investasi/KI - Installment',
      'Working Capital - Installment',
      'CURRENT DEPOSITS',
      'Kredit Modal kerja/KMK - Installment',
    ],
    interestRateTypeList: [
      'FIXED',
      'LIBOR',
      'JIBOR',
      'TIBOR',
      'HIBOR',
      'EURIBOR',
      'EURO-LIBOR',
      'FED FUND',
      'OTHER',
      'BSBY',
      'TERM SOFR',
      'FLOAT',
      'BACK TO BACK',
      'SDBI',
      'SBI',
      'PRIME',
    ],

    rateAmountTypeList: ['%p.a', 'Amount IDR', 'Amount USD'],
    gracePeriodTypeList: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],
  };

  public applicationProduct: IApplicationProduct;
  public statusDisabledOffering: boolean;
  public status = false;
  public unComitted = true;
  public com = true;
  public uncom = false;
  private creditProposalData: ICreditProposal;
  selection = true;
  public setDate: string;
  public currencyName: number;

  // Code Lov get General Parameter  List Of Value Improvement Phase 1
  public interestTypeList = [];
  public installmentTypeList = [];
  public jenisPenggunaList = [];
  public creditTermList = [];
  public installmentMethodList = [];
  public lovDisbursementLegalList = [];
  public restructList = [];
  public installmentMethodValue: string;
  public restructMethodValue: string;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICreditProposal;
      applicationProduct: IApplicationProduct;
      collateralInfo: any;
      collateralProductRelations: any;
      creditProposaldata: ICreditProposal;
    },
    protected applicationOptionService: ApplicationOptionService,
    public indexRateService: IndexRateService,
    public creditProposalService: CreditProposalService,

    // Code Lov get General Parameter  List Of Value Improvement Phase 1
    public generalParameterService: GeneralParameterService,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    protected productParameterService: MasterProductParameterService,
    protected productClasificationService: ProductClassificationService,
    private _dialog: MatDialogRef<CreditProposalLoanFacilityDialogComponent>,
    protected messageService: MessageService
  ) {
    super(creditProposalService);
    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
    if (this.data.creditProposaldata.statusId === 'DRAFT') {
      _dialog.disableClose = true;
      _dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
    this.dataItem = this.data.item;
    this.applicationProduct = this.data.applicationProduct;
    this.creditProposalData = this.data.creditProposaldata;
    this.ccy = this.data.applicationProduct.currencyId;
    this.rateType = this.data.applicationProduct.rateTypeName;
    this.dateIndex = this.data.applicationProduct.intResetFrequency;
    this.indexRateServiceFun();
    this.lovDisbursementLegal();
  }

  ngOnInit(): void {
    if (this.applicationProduct.attributes['loanPurposeLegal'] === '') {
      this.applicationProduct.attributes['loanPurposeLegal'] = this.applicationProduct.attributes['loanPurpose'];
    }
    this.cekApplicationType();
    this.getLovSublimit();
    this.lovIndex = this.lovSublimit.filter(obj => obj.label === this.applicationProduct.sublimitFromExistingFacility);

    this.disableButtonChange(this.applicationProduct.productTypeId);
    this.chnageCurrency(this.applicationProduct.currencyId);

    this.conditionFieldInOfferingLetter();
    this.getApplicationOption();
    this.getObligation();
    this.setFacilityType();

    // Code Lov get General Parameter  List Of Value Improvement Phase 1
    this.lovInstallmentMethod();
    this.lovInterestRateTypeList();
    this.lovRestructMethod();
    this.getFacilityType();
    this.berubah(this.applicationProduct.attributes.facilityType);
    this.cekData();
    this.updateFormat(this.selectedType, this.selectedCurrency);
    this.lovInstalmentType();
    this.lovCreditTermList();
    this.lovJenisPengguna();

    if (!this.applicationProduct.commitedLine) {
      this.applicationProduct.commitedLine = false;
    }
  }

  public cekData() {
    this.changeAmountType(this.applicationProduct.adminFeeType, 'admin');
    this.changeAmountType(this.applicationProduct.provisionFeeType, 'provision');
  }

  public save(): void {
    if (this.creditProposalData.statusId === 'DRAFT') {
      this.applicationProduct.attributes['loanPurposeLegal'] = this.applicationProduct.attributes['loanPurpose'];
    }
    this._dialog.close({
      applicationProduct: this.applicationProduct,
      creditProposal: this.creditProposalData,
    });
  }

  public changeIntRateType(event: any): void {
    this.rateType = event;
    this.indexRateServiceFun();
    if (event === 'OTHER' || event === 'FIXED' || event === 'FED FUND') {
      this.statIntRate = true;
    } else {
      this.statIntRate = false;
    }
  }

  public periodeDate(event: any) {
    this.dateIndex = Number(event);
    this.applicationProduct.intResetFrequency = Number(event);
    this.indexRateServiceFun();
  }

  indexRateServiceFun() {
    if (!this.rateType) {
      this.rateType = '';
    }
    if (this.rateType === 'FIXED') {
      if (this.ccy !== '') {
        this.indexRateService.find('get?&ccy=' + this.ccy + '&rateType=FIXED').subscribe((res: any) => {
          for (let i = 1; i < 13; i++) {
            if (i === this.dateIndex) {
              this.indexRate = res.body['rate' + i + 'M'];
            }
          }
        });
      }
    } else {
      const dateNew = new Date().toISOString().split('T')[0];
      if (this.rateType !== '' && this.ccy !== '' && dateNew) {
        if (this.rateType !== 'TERM SOFR') {
          this.indexRateService
            .find('get?date=' + dateNew.replace(/-/g, '') + '&ccy=' + this.ccy + '&rateType=' + this.rateType.substring(0, 3))
            .subscribe((res: any) => {
              for (let i = 1; i < 13; i++) {
                if (i === this.dateIndex) {
                  this.indexRate = res.body['rate' + i + 'M'] + '%';
                  this.applicationProduct.indexRateStr = this.indexRate;
                }
              }
            });
        } else {
          this.indexRateService
            .find('get?date=' + dateNew.replace(/-/g, '') + '&ccy=' + this.ccy + '&rateType=' + this.rateType.substring(5, 8))
            .subscribe((res: any) => {
              for (let i = 1; i < 13; i++) {
                if (i === this.dateIndex) {
                  this.indexRate = res.body['rate' + i + 'M'] + '%';
                  this.applicationProduct.indexRateStr = this.indexRate;
                }
              }
            });
        }
      }
    }
  }

  public berubah(event: any): void {
    this.applicationProduct.productTypeId = this.applicationProduct.attributes.facilityType;
    if (event === 'FN - Syndicate loan / club deal') {
      this.status = true;
    } else {
      this.status = false;
    }
    // this.creditProposalService.getFacilityProductList(event).subscribe(res => {
    //   this.listLoanType = res.body;
    // });

    this.productParameterService
      .queryFilterBy({
        idProductType: event,
        isActive: true,
        size: 9999,
      })
      .subscribe(res => {
        this.listLoanType = res.body;
        this.getfacilityCategory(this.applicationProduct.productName);
      });

    this.disableButtonChange(event);
  }

  public disableButtonChange(value: string) {
    const result = this.listOfValue.facilityTypeList.find(obj => obj === value);
    if (value !== '') {
      if (result !== undefined) {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
    } else {
      this.disableButton = false;
    }
  }

  public calTotalPlafond(revolving?: Boolean): number {
    this.revolving = revolving;
    if (revolving === true) {
      return Number(
        (this.applicationProduct.totalPlafond = Number(this.applicationProduct.initialLimit) + Number(this.applicationProduct.changes))
      );
    } else if (revolving === false) {
      return Number(
        (this.applicationProduct.totalPlafond = Number(this.applicationProduct.outstanding) + Number(this.applicationProduct.changes))
      );
    }
    return 0;
  }

  public getLovSublimit() {
    for (let i = 0; i < this.creditProposalData.products.length; i++) {
      if (
        this.creditProposalData.products[i].productTypeId !== '' &&
        this.creditProposalData.products[i].nomorUrutFasilitas !== this.applicationProduct.nomorUrutFasilitas
      ) {
        this.lovSublimit.push({
          label: this.creditProposalData.products[i].productTypeId,
          index: this.creditProposalData.products[i].nomorUrutFasilitas,
        });
        const result = this.labelSublimit.find(obj => obj === this.creditProposalData.products[i].productTypeId);
        if (result === undefined) {
          this.labelSublimit.push(this.creditProposalData.products[i].productTypeId);
        }
      }
    }
    if (this.lovSublimit.length > 0) {
      this.disButtonSub = false;
    }
  }

  public changeSublimit(event) {
    this.lovIndex = this.lovSublimit.filter(obj => obj.label === event);
    if (this.lovIndex.length > 0) {
      this.applicationProduct.indexFacilityMain = this.lovIndex[0].index;
    } else {
      this.applicationProduct.indexFacilityMain = '';
    }
  }

  public changeSublimitCheck() {
    if (this.applicationProduct.subLimit === false) {
      this.applicationProduct.sublimitFromExistingFacility = '';
      this.applicationProduct.indexFacilityMain = '';
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.listOfValue.facilityTypeList.filter(option => option.toLowerCase().includes(filterValue));
  }

  public getCreditProposalMappingData(creditProposalMappingData: any): void {
    this.creditProposalData = creditProposalMappingData;
  }
  public printElement(element) {
    let sublimit: string;
    sublimit = '';
    if (element === true || element === 'true') {
      sublimit = 'Yes';
    } else if (element === false || element === 'false') {
      sublimit = 'No';
    }
    return sublimit;
  }

  public cursIdr: number;

  getCurs() {
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.cursIdr = res.body[0]?.factor;
      this.applicationProduct.initialLimit = this.applicationProduct.initialLimit * this.cursIdr;
      this.applicationProduct.outstanding = this.applicationProduct.outstanding * this.cursIdr;
      this.applicationProduct.changes = this.applicationProduct.changes * this.cursIdr;
    });
  }

  chnageCurrency(value: string) {
    this.ccy = value;
    this.indexRateServiceFun();
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency(value, 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyName = res.body[0]?.factor;
      this.applicationProduct.kurs = res.body[0]?.factor;
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
          this.applicationProduct.initialLimit = this.applicationProduct.initialLimit / this.currencyName;
          this.applicationProduct.outstanding = this.applicationProduct.outstanding / this.currencyName;
          this.applicationProduct.changes = this.applicationProduct.changes / this.currencyName;
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

  public fee: any;

  removeSymbolCcy(node) {
    this.fee = document.querySelectorAll('.fee');
    let ccy = node.innerHTML;
    ccy = ccy.replace(/\$ /g, '');
    node.innerHTML = this.fee;
  }

  textBoxHidden: boolean;
  paymentIDR: boolean;
  checklissHidden: boolean;
  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;
  public isDisabled(): boolean {
    if (
      this.parentPath === 'confirmation' &&
      (this.selectedMenu === 'loan-facility-detail' || this.selectedMenu === 'compare-approval-report')
    ) {
      return true;
    }
    return false;
  }
  // Condition Field in Offering Letter
  public conditionFieldInOfferingLetter() {
    const queryParam = new URLSearchParams(this.router.url.split('?')[1]);
    const subroutes = queryParam.get('subroute');
    // Condition Offering Letter in Route Finalize
    if (this.parentPath === 'finalize' || this.parentPath === 'finalize-dppk') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and can be changed
      if (this.selectedMenu === 'loan-facility-detail') {
        this.textBoxHidden = false;
        this.checklissHidden = true;
        this.statusDisabledOffering = false;
        this.paymentIDR = true;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report' || this.selectedMenu === 'loan-facility') {
        this.textBoxHidden = false;
        this.checklissHidden = true;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.checklissHidden = false;
        this.statusDisabledOffering = false;
      }

      // Condition Offering Letter in Route Distribution
    } else if (this.parentPath === 'distribution' || this.parentPath === 'review-dppk') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and cannot be changed
      if (this.selectedMenu === 'loan-facility-detail' || this.selectedMenu === 'loan-facility') {
        if (this.dataItem.statusId === 'OL_ASSIGNED') {
          this.textBoxHidden = false;
          this.checklissHidden = true;
          this.statusDisabledOffering = false;
        } else {
          this.textBoxHidden = false;
          this.checklissHidden = true;
          this.statusDisabledOffering = true;
        }
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.checklissHidden = true;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.checklissHidden = true;
        this.statusDisabledOffering = true;
      }

      // Condition Offering Letter in Route Review
    } else if (this.parentPath === 'review' || this.parentPath === 'confirmation') {
      if (this.selectedMenu === 'loan-facility-detail' || this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.checklissHidden = true;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.checklissHidden = false;
        this.statusDisabledOffering = true; // Menambahkan perubahan di sini
      }
    } else if (
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'dar-revision-checker'
    ) {
      this.textBoxHidden = false;
      this.checklissHidden = true;
      this.statusDisabledOffering = true;
    } else if (this.parentPath === 'dar-revision') {
      if (subroutes === 'loan-facility') {
        this.textBoxHidden = false;
        this.checklissHidden = true;
        this.statusDisabledOffering = false;
      } else {
        this.textBoxHidden = false;
        this.checklissHidden = true;
        this.statusDisabledOffering = true;
      }
    } else {
      this.textBoxHidden = true;
      this.checklissHidden = false;
      this.statusDisabledOffering = true; // Menambahkan perubahan di sini
    }
  }

  public latePaymentFeeUSD: any;
  public latePaymentFeeIDR: any;
  public paymentObligationNonAngsuran: any;
  public paymentObligationAngsuran: any;

  public datacoba = '';
  public getApplicationOption() {
    this.applicationOptionService.query().subscribe(res => {
      for (let i = 0; i < res.body.length; i++) {
        if (res.body[i].id === 'LATE_PAYMENT_FEE_USD') {
          if (this.applicationProduct.latePaymentFee === '' || this.applicationProduct.latePaymentFee === undefined) {
            if (this.applicationProduct.currencyId === 'USD') {
              this.applicationProduct.latePaymentFee = res.body[i].value;
            }
          }
        }
        if (res.body[i].id === 'LATE_PAYMENT_FEE_IDR') {
          if (this.applicationProduct.latePaymentFee === '' || this.applicationProduct.latePaymentFee === undefined) {
            if (this.applicationProduct.currencyId === 'IDR') {
              this.applicationProduct.latePaymentFee = res.body[i].value;
            }
          }
        }
        if (res.body[i].id === 'PAYMENT_OBLIGATION_NON_ANGSURAN_REMARK') {
          if (
            this.applicationProduct.attributes['paymentObligation'] === '' ||
            this.applicationProduct.attributes['paymentObligation'] === undefined
          ) {
            if (this.applicationProduct.productTypeId === 'BG' || this.applicationProduct.productTypeId === 'LC') {
              this.applicationProduct.attributes['paymentObligation'] = res.body[i].value;
            }
          }
        }
        if (res.body[i].id === 'PAYMENT_OBLIGATION_ANGSURAN_REMARK') {
          if (
            this.applicationProduct.attributes['paymentObligation'] === '' ||
            this.applicationProduct.attributes['paymentObligation'] === undefined
          ) {
            if (
              this.applicationProduct.productTypeId === 'DL' ||
              this.applicationProduct.productTypeId === 'MML' ||
              this.applicationProduct.productTypeId === 'FL' ||
              this.applicationProduct.productTypeId === 'IL' ||
              this.applicationProduct.productTypeId === 'OD'
            ) {
              this.applicationProduct.attributes['paymentObligation'] = res.body[i].value;
            }
          }
        }
      }
    });
  }

  public obligationCashLoan: number;
  public obligationNonCashLoan: number;

  public getObligation() {
    this.obligationCashLoan = 3;
    this.obligationNonCashLoan = 2;

    if (this.applicationProduct.earlyRepaymentPenalty === null) {
      if (
        this.applicationProduct.productTypeId === 'DL' ||
        this.applicationProduct.productTypeId === 'MML' ||
        this.applicationProduct.productTypeId === 'FL' ||
        this.applicationProduct.productTypeId === 'IL' ||
        this.applicationProduct.productTypeId === 'OD'
      ) {
        this.applicationProduct.earlyRepaymentPenalty = this.obligationCashLoan;
      }
      if (this.applicationProduct.productTypeId === 'BG' || this.applicationProduct.productTypeId === 'LC') {
        this.applicationProduct.earlyRepaymentPenalty = this.obligationNonCashLoan;
      }
    }
  }

  public applicationTypeChange(event: any) {
    this.statusFacilityValue = event.value;
    if (this.statusFacilityValue === 'Existing') {
      this.myControl.disable();
      this.statusFacilityDisabled = true;
    } else {
      this.myControl.enable();
      this.statusFacilityDisabled = false;
    }
    if (this.statusFacilityValue === 'Others') {
      this.othersDescStat = false;
    } else {
      this.othersDescStat = true;
    }
  }

  cekApplicationType() {
    if (this.applicationProduct.applicationType === 'Existing') {
      // this.getObligation();
      this.myControl.disable();
      this.statusFacilityDisabled = true;
    } else {
      this.myControl.enable();
      this.statusFacilityDisabled = false;
    }
    if (this.applicationProduct.applicationType === 'Others') {
      this.othersDescStat = false;
    }
    if (this.applicationProduct.applicationType !== 'Existing') {
      this.applicationProduct.attributes.facilityType = this.applicationProduct.productTypeId;
    }
  }

  setFacilityType() {
    this.creditProposalService.getFacilityTypeProduct().subscribe(res => {
      this.listFacicility = res.body;
      const dataData = Object.entries(
        this.listFacicility.reduce((acc, { id, label }) => {
          if (!acc[label]) {
            acc[label] = [];
          }
          acc[label].push(id);

          return acc;
        }, {})
      ).map(([label, id]) => ({ label, id }));
      this.listFacicility = dataData;
    });
  }

  // Code Lov get General Parameter  List Of Value Improvement Phase 1

  public lovInterestRateTypeList() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INTEREST_RATE_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.interestTypeList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public lovInstalmentType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSTALLMENT_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.installmentTypeList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public lovJenisPengguna() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'JENIS_PENGGUNA',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.jenisPenggunaList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public lovCreditTermList() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'CREDIT_TERM',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.creditTermList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public lovInstallmentMethod() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSTALLMENT_METHOD',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.installmentMethodList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        if (this.installmentMethodList) {
          let element: string;
          for (let i = 0; i < this.installmentMethodList.length; i++) {
            if (this.applicationProduct.installmentMethod === this.installmentMethodList[i].code) {
              element = this.installmentMethodList[i].value;
            }
          }
          this.installmentMethodValue = element;
        }
      });
  }

  public lovRestructMethod() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RESTRUCT_METHOD',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.restructList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        if (this.restructList) {
          let element: string;
          for (let i = 0; i < this.restructList.length; i++) {
            if (this.applicationProduct.restructMethod === this.restructList[i].code) {
              element = this.restructList[i].value;
            }
          }
          this.restructMethodValue = element;
        }
      });
  }

  public getFacilityType() {
    this.productParameterService.getLovFacilityType().subscribe(res => {
      this.listGeneralLov = res.body;
      if (this.masterProduct.productTypeId !== '') {
        for (let i = 0; i < this.listGeneralLov.length; i++) {
          this.masterProduct.productTypeId = this.listGeneralLov[i].id;
        }
      }
    });
  }

  public getfacilityCategory(event) {
    const data = this.listLoanType.find(obj => obj.name === event);

    if (data) {
      this.productClasificationService
        .queryFilterBy({
          idProduct: data.id,
          isActive: true,
          page: 0,
          size: 9999,
          sort: ['asc'],
        })
        .subscribe(res => {
          this.listCategoryLov = res.body;
        });
      this.applicationProduct.productId = data.id;
      this.calTotalPlafond(data.revolving);
      const disbursementLegal = this.lovDisbursementLegalList.find(obj => obj.code === data.code);
      if (disbursementLegal) {
        this.applicationProduct.attributes['paymentObligation'] = disbursementLegal.value;
      }
    }
  }

  public lovDisbursementLegal() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'DISBURSEMENT_CONDITION_LEGAL',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.lovDisbursementLegalList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public setPeriodeType() {
    if (this.applicationProduct.intResetPeriod === 'Month') {
      this.applicationProduct.intResetFrequencyParam = 'M';
    }
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

  public changeAmountType(event, type) {
    this.selectedType = type;
    this.selectedCurrency = event;
    this.updateFormat(this.selectedType, this.selectedCurrency);
  }

  public updateFormat(type, event) {
    if (type === 'provision') {
      if (event === '%p.a') {
        this.logoProvisonFee = this.provisionFormat;
      }
      if (event === 'Amount IDR') {
        this.logoProvisonFee = 'IDR ' + this.provisionFormat;
      }
      if (event === 'Amount USD') {
        this.logoProvisonFee = 'USD ' + this.provisionFormat;
      }
      if (event === '' || event === undefined) {
        this.logoProvisonFee = '';
      }
    }
    if (type === 'admin') {
      if (event === '%p.a') {
        this.logoAdminFee = this.adminFormat;
      }
      if (event === 'Amount IDR') {
        this.logoAdminFee = 'IDR ' + this.adminFormat;
      }
      if (event === 'Amount USD') {
        this.logoAdminFee = 'USD ' + this.adminFormat;
      }
      if (event === '' || event === undefined) {
        this.logoAdminFee = '';
      }
    }
  }

  public onSave(): void {
    this.validate().then(() => this.save());
  }

  // Validation Loan Facility
  private _validateProcess(toValidate: object) {
    let isAllTrue = true;
    for (const key in toValidate) {
      if (Object.prototype.hasOwnProperty.call(toValidate, key)) {
        if (toValidate[key] === false) {
          isAllTrue = false;
          break;
        }
      }
    }

    return isAllTrue;
  }

  private _showNotification(severity: string, message: string): void {
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({ severity, summary: severityCaptitalized, detail: message, life: 3000 });
  }

  public checkMustValidated() {
    const mustValidate = {
      // maturityDate: true,
      currencyId: true,
    };

    // if (!this.applicationProduct.maturityDate) {
    //   this._showNotification('error', 'Masukkan Maturity Date terlebih dahulu');
    //   mustValidate.maturityDate = false;
    // }

    if (!this.applicationProduct.currencyId) {
      this._showNotification('error', 'Masukkan Currency terlebih dahulu');
      mustValidate.currencyId = false;
    }

    return this._validateProcess(mustValidate);
  }

  public validateLoanFacility(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Loan Facility Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateLoanFacility().then(() => resolve(true));
    });
  }

  public tenorChange() {
    const date = new Date(this.applicationProduct.startDateContract);
    if (this.applicationProduct.periodType) {
      switch (this.applicationProduct.periodType) {
        case 'Week':
          this.dataTrhu = new Date();
          this.dataTrhu = new Date(date.setDate(date.getDate() + this.applicationProduct.tenor * 7));
          break;
        case 'Month':
          this.dataTrhu = new Date(date.setMonth(date.getMonth() + this.applicationProduct.tenor));
          break;
        case 'Year':
          this.dataTrhu = new Date();
          this.dataTrhu = new Date(date.setFullYear(date.getFullYear() + this.applicationProduct.tenor));
          break;
      }
      this.applicationProduct.attributes['thruDateContractTemp'] = this.dataTrhu;
    }
  }

  // for disbursement checkliss condition
  public disableRemarkDisbursement = true;
  checklisDisbursement() {
    if (this.parentPath === 'finalize') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and can be changed
      if (this.selectedMenu === 'loan-facility-detail') {
        return true;
      }
    } else {
      if (
        this.applicationProduct.attributes['disbursementChecklisCon'] === 'true' ||
        this.applicationProduct.attributes['disbursementChecklisCon'] === true
      ) {
        return true;
      }
    }
    return false;
  }

  getCreditTermLabel(index: string) {
    if (index) {
      return this.creditTermList.find(obj => obj.code === index).value;
    }
    return '';
  }

  conditionReviewDppk() {
    if (this.parentPath === 'review-dppk') {
      return true;
    }
    if (this.parentPath === 'finalize-dppk' && this.selectedMenu !== 'loan-facility') {
      return true;
    }
    return false;
  }

  public disableSublimit() {
    if (this.applicationProduct.sublimitFromExistingFacility) {
      return false;
    }
    return true;
  }

  public changePengguna() {
    if (this.applicationProduct.jenisPenggunaCode) {
      this.applicationProduct.jenisPenggunaId = this.jenisPenggunaList.find(
        obj => obj.code === this.applicationProduct.jenisPenggunaCode
      ).id;
      console.log(this.applicationProduct.jenisPenggunaId);
    }
  }
}
