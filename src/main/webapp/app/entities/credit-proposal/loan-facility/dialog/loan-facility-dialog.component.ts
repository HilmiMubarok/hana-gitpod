import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  public installmentMethodList = [];
  public restructList = [];

  constructor(
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
    private _dialog: MatDialogRef<CreditProposalLoanFacilityDialogComponent>
  ) {
    super(creditProposalService);
    this.dataItem = this.data.item;
    this.applicationProduct = this.data.applicationProduct;
    this.creditProposalData = this.data.creditProposaldata;
    this.ccy = this.data.applicationProduct.attributes['currency'];
    this.rateType = this.data.applicationProduct.attributes['interestRateType'];
    this.dateIndex = this.data.applicationProduct.attributes['interestRatePeriod'];
    this.indexRateServiceFun();
  }

  ngOnInit(): void {
    this.cekApplicationType();
    this.getLovSublimit();
    this.lovIndex = this.lovSublimit.filter(obj => obj.label === this.applicationProduct.attributes['sublimitFromExistingFacility']);

    this.disableButtonChange(this.applicationProduct.attributes['facilityType']);
    this.chnageCurrency(this.applicationProduct.attributes['currency']);

    this.conditionFieldInOfferingLetter();
    this.getApplicationOption();
    this.getObligation();
    this.setFacilityType();
    this.loaddata();

    // Code Lov get General Parameter  List Of Value Improvement Phase 1
    this.lovInstallmentMethod();
    this.lovInterestRateTypeList();
    this.lovRestructMethod();
  }

  public save(): void {
    this._dialog.close({
      applicationProduct: this.applicationProduct,
      creditProposal: this.creditProposalData,
    });
  }

  public changeIntRateType(event: any): void {
    this.rateType = event;
    if (event === 'TERM SOFR') {
      this.rateType = event.substring(5, 8);
    }
    this.indexRateServiceFun();
    if (event === 'OTHER' || event === 'FIXED' || event === 'FED FUND') {
      this.statIntRate = true;
    } else {
      this.statIntRate = false;
    }
  }

  public periodeDate(event: any) {
    this.dateIndex = event;
    this.indexRateServiceFun();
  }

  indexRateServiceFun() {
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
        this.indexRateService
          .find('get?date=' + dateNew + '&ccy=' + this.ccy + '&rateType=' + this.rateType.substring(0, 3))
          .subscribe((res: any) => {
            for (let i = 1; i < 13; i++) {
              if (i === this.dateIndex) {
                this.indexRate = res.body['rate' + i + 'M'] + '%';
                this.applicationProduct.attributes.indexRate = this.indexRate;
              }
            }
          });
      }
    }
  }

  public berubah(event: any): void {
    if (event === 'FN - Syndicate loan / club deal') {
      this.status = true;
    } else {
      this.status = false;
    }
    this.creditProposalService.getFacilityProductList(event).subscribe(res => {
      this.listLoanType = res.body;
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

  public calTotalPlafond(): number {
    this.applicationProduct.attributes.totalPlafond =
      Number(this.applicationProduct.attributes.initialLimit) + Number(this.applicationProduct.attributes.changes);
    return Number(this.applicationProduct.attributes.initialLimit) + Number(this.applicationProduct.attributes.changes);
  }

  public getLovSublimit() {
    for (let i = 0; i < this.creditProposalData.products.length; i++) {
      if (this.creditProposalData.products[i].attributes.facilityType !== '') {
        this.lovSublimit.push({
          label: this.creditProposalData.products[i].attributes.facilityType,
          index: this.creditProposalData.products[i].attributes.nomorUrutFasilitas,
        });
        const result = this.labelSublimit.find(obj => obj === this.creditProposalData.products[i].attributes.facilityType);
        if (result === undefined) {
          this.labelSublimit.push(this.creditProposalData.products[i].attributes.facilityType);
        }
      }
    }
    if (this.lovSublimit.length > 0) {
      this.disButtonSub = false;
    }
  }

  public changeSublimit(event) {
    this.lovIndex = this.lovSublimit.filter(obj => obj.label === event);
    this.applicationProduct.attributes['indexFacilityMain'] = this.lovIndex[0].index;
  }

  public changeSublimitCheck() {
    if (this.applicationProduct.attributes['subLimit'] === false) {
      this.applicationProduct.attributes['sublimitFromExistingFacility'] = '';
      this.applicationProduct.attributes['indexFacilityMain'] = '';
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
    let subLimit: string;
    subLimit = '';
    if (element === true || element === 'true') {
      subLimit = 'Yes';
    } else if (element === false || element === 'false') {
      subLimit = 'No';
    }
    return subLimit;
  }

  public cursIdr: number;

  getCurs() {
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.cursIdr = res.body[0]?.factor;
      this.applicationProduct.attributes['initialLimit'] = this.applicationProduct.attributes['initialLimit'] * this.cursIdr;
      this.applicationProduct.attributes['outstanding'] = this.applicationProduct.attributes['outstanding'] * this.cursIdr;
      this.applicationProduct.attributes['changes'] = this.applicationProduct.attributes['changes'] * this.cursIdr;
    });
  }

  chnageCurrency(value: string) {
    this.ccy = value;
    this.indexRateServiceFun();
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency(value, 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyName = res.body[0]?.factor;
      this.applicationProduct.attributes['kurs'] = res.body[0]?.factor;
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
          this.applicationProduct.attributes['initialLimit'] = this.applicationProduct.attributes['initialLimit'] / this.currencyName;
          this.applicationProduct.attributes['outstanding'] = this.applicationProduct.attributes['outstanding'] / this.currencyName;
          this.applicationProduct.attributes['changes'] = this.applicationProduct.attributes['changes'] / this.currencyName;
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
  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;

  // Condition Field in Offering Letter
  public conditionFieldInOfferingLetter() {
    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
    console.log('in the menu : ', this.selectedMenu);
    // Condition Offering Letter in Route Finalize
    if (this.parentPath === 'finalize') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and can be changed
      if (this.selectedMenu === 'loan-facility-detail') {
        this.textBoxHidden = false;
        this.status = false;
        this.paymentIDR = true;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.status = true;
      } else {
        this.textBoxHidden = true;
      }

      // Condition Offering Letter in Route Distribution
    } else if (this.parentPath === 'distribution') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and cannot be changed
      if (this.selectedMenu === 'loan-facility-detail') {
        if (this.dataItem.statusId === 'OL_ASSIGNED') {
          this.textBoxHidden = false;
          this.status = false;
        } else {
          this.textBoxHidden = false;
          this.status = true;
        }
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.status = true;
      } else {
        this.textBoxHidden = true;
      }

      // Condition Offering Letter in Route Review
    } else if (this.parentPath === 'review') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and cannot be changed
      if (this.selectedMenu === 'loan-facility-detail') {
        this.textBoxHidden = false;
        this.status = true;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.status = true;
      } else {
        this.textBoxHidden = true;
      }

      // Condition Offering Letter in Route Confirmation
    } else if (this.parentPath === 'confirmation') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and cannot be changed
      if (this.selectedMenu === 'loan-facility-detail') {
        this.textBoxHidden = false;
        this.status = true;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.status = true;
      } else {
        this.textBoxHidden = true;
      }
    } else {
      // other than in the offering letter field cannot be displayed and changed
      this.textBoxHidden = true;
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
          if (
            this.applicationProduct.attributes['latePaymentFee'] === '' ||
            this.applicationProduct.attributes['latePaymentFee'] === undefined
          ) {
            if (this.applicationProduct.attributes['currency'] === 'USD') {
              this.applicationProduct.attributes['latePaymentFee'] = res.body[i].value;
            }
          }
        }
        if (res.body[i].id === 'LATE_PAYMENT_FEE_IDR') {
          if (
            this.applicationProduct.attributes['latePaymentFee'] === '' ||
            this.applicationProduct.attributes['latePaymentFee'] === undefined
          ) {
            if (this.applicationProduct.attributes['currency'] === 'IDR') {
              this.applicationProduct.attributes['latePaymentFee'] = res.body[i].value;
            }
          }
        }
        if (res.body[i].id === 'PAYMENT_OBLIGATION_NON_ANGSURAN_REMARK') {
          if (
            this.applicationProduct.attributes['paymentObligation'] === '' ||
            this.applicationProduct.attributes['paymentObligation'] === undefined
          ) {
            if (
              this.applicationProduct.attributes['facilityType'] === 'BG' ||
              this.applicationProduct.attributes['facilityType'] === 'LC'
            ) {
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
              this.applicationProduct.attributes['facilityType'] === 'DL' ||
              this.applicationProduct.attributes['facilityType'] === 'MML' ||
              this.applicationProduct.attributes['facilityType'] === 'FL' ||
              this.applicationProduct.attributes['facilityType'] === 'IL' ||
              this.applicationProduct.attributes['facilityType'] === 'OD'
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

    if (
      this.applicationProduct.attributes['earlyRepaymentPenalty'] === '0' ||
      this.applicationProduct.attributes['earlyRepaymentPenalty'] === undefined
    ) {
      if (
        this.applicationProduct.attributes['facilityType'] === 'DL' ||
        this.applicationProduct.attributes['facilityType'] === 'MML' ||
        this.applicationProduct.attributes['facilityType'] === 'FL' ||
        this.applicationProduct.attributes['facilityType'] === 'IL' ||
        this.applicationProduct.attributes['facilityType'] === 'OD'
      ) {
        this.applicationProduct.attributes['earlyRepaymentPenalty'] = this.obligationCashLoan;
      }
      if (this.applicationProduct.attributes['facilityType'] === 'BG' || this.applicationProduct.attributes['facilityType'] === 'LC') {
        this.applicationProduct.attributes['earlyRepaymentPenalty'] = this.obligationNonCashLoan;
      }
    }
  }

  public applicationTypeChange(event: any) {
    this.statusFacilityValue = event.value;
    if (this.statusFacilityValue === 'Existing' || this.statusFacilityValue === 'Renewal' || this.statusFacilityValue === 'Renewal') {
      this.myControl.disable();
      this.statusFacilityDisabled = true;
    } else {
      this.myControl.enable();
      this.statusFacilityDisabled = false;
    }
  }

  cekApplicationType() {
    if (this.applicationProduct.attributes['applicationType'] === 'Existing') {
      // this.getObligation();
      this.myControl.disable();
      this.statusFacilityDisabled = true;
    } else {
      this.myControl.enable();
      this.statusFacilityDisabled = false;
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

  public loaddata() {
    const dateNew = new Date().toISOString().split('T')[0];
    this.indexRateService
      .find('get?date=' + dateNew + '&ccy=' + this.ccy + '&rateType=' + this.rateType.substring(0, 3))
      .subscribe((res: any) => {
        this.applicationProduct.attributes.indexRate = res.body['rate' + this.dateIndex + 'M'] + '%';
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
        console.log('interest type', this.interestTypeList);
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
        console.log('installment ', this.installmentMethodList);
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
        console.log('restruct', this.restructList);
      });
  }
}
