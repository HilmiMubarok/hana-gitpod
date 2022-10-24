import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ICreditProposal } from '../../credit-proposal.model';
// import

@Component({
  selector: 'jhi-loan-facility-dialog',
  templateUrl: './loan-facility-dialog.component.html',
  styleUrls: ['./dialog-facility.css'],
})
export class CreditProposalLoanFacilityDialogComponent implements OnInit {
  private _collateral: ICollateral;
  private _creditproposal: ICreditProposal;
  public dataItem: ICreditProposal;
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
    // this.checkData();
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
    ],
    interestRateTypeList: ['FIXED', 'LIBOR', 'JIBOR', 'TIBOR', 'HIBOR', 'EURIBOR', 'EURO-LIBOR', 'FED FUND', 'OTHER', 'BSBY', 'TERM SOFR'],

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
  public collateralInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: ICreditProposal;
  selection = true;
  applicationProdCustom: any;
  dataProductId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICreditProposal;
      applicationProduct: IApplicationProduct;
      collateralInfo: any;
      collateralProductRelations: any;
      creditProposaldata: ICreditProposal;
    },
    private _dialog: MatDialogRef<CreditProposalLoanFacilityDialogComponent>
  ) {
    this.dataItem = this.data.item;
    this.applicationProduct = this.data.applicationProduct;
    this.collateralInfo = this.data.collateralInfo;
    this.creditProposaldata = this.data.creditProposaldata;
    this.collateralProductRelations = this.data.collateralProductRelations;
    this.applicationProdCustom = this.collateralInfo && this.applicationProduct;
  }
  ngOnInit(): void {
    this.getLovSublimit();
    this.lovIndex = this.lovSublimit.filter(obj => obj.label === this.applicationProduct.attributes['sublimitFromExistingFacility']);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.disableButtonChange(this.applicationProduct.attributes['facilityType']);
    this.changeCcy(this.applicationProduct.attributes['currency']);
  }

  public save(): void {
    this._dialog.close(this.applicationProdCustom);
  }

  public changeIntRateType(event: any): void {
    console.log(event);
    if (event === 'OTHER' || event === 'FIXED' || event === 'FED FUND') {
      this.statIntRate = true;
    } else {
      this.statIntRate = false;
    }
  }

  public berubah(event: any): void {
    if (event === 'FN - Syndicate loan / club deal') {
      this.status = true;
    } else {
      this.status = false;
    }

    switch (event) {
      case 'OD':
        this.lovLoanType = this.listOfValue.lovOd;
        break;
      case 'WCI':
        this.lovLoanType = this.listOfValue.lovWci;
        break;
      case 'DL':
        this.lovLoanType = this.listOfValue.lovDl;
        break;
      case 'MML':
        this.lovLoanType = this.listOfValue.lovMml;
        break;
      case 'FL':
        this.lovLoanType = this.listOfValue.lovfL;
        break;
      case 'IL':
        this.lovLoanType = this.listOfValue.lovIl;
        break;
      case 'BG':
        this.lovLoanType = this.listOfValue.lovBg;
        break;
      case 'LC':
        this.lovLoanType = this.listOfValue.lovLc;
        break;
      default:
        this.lovLoanType = [];
    }

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
    for (let i = 0; i < this.creditProposaldata.products.length; i++) {
      if (this.creditProposaldata.products[i].attributes.facilityType !== '') {
        this.lovSublimit.push({
          label: this.creditProposaldata.products[i].attributes.facilityType,
          index: this.creditProposaldata.products[i].attributes.nomorUrutFasilitas,
        });
        const result = this.labelSublimit.find(obj => obj === this.creditProposaldata.products[i].attributes.facilityType);
        if (result === undefined) {
          this.labelSublimit.push(this.creditProposaldata.products[i].attributes.facilityType);
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

  public changeCcy(event: string) {
    if (this.preCurent === '') {
      if (event === 'IDR') {
        this.conCcy = true;
        this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
        this.preCurent = 'IDR';
      } else {
        this.conCcy = true;
        this.logoCcy = {};
        this.preCurent = 'USD';
      }
    } else if (this.preCurent === 'IDR') {
      if (event === '') {
        this.conCcy = false;
        this.preCurent = '';
      } else {
        this.conCcy = true;
        this.logoCcy = {};
        this.applicationProduct.attributes['initialLimit'] =
          this.applicationProduct.attributes['initialLimit'] * this.applicationProduct.attributes['kurs'];
        this.preCurent = 'USD';
      }
    } else if (this.preCurent === 'USD') {
      if (event === '') {
        this.conCcy = false;
      } else {
        this.conCcy = true;
        this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
        this.applicationProduct.attributes['initialLimit'] =
          this.applicationProduct.attributes['initialLimit'] / this.applicationProduct.attributes['kurs'];
        this.preCurent = 'IDR';
      }
    }
  }

  public print() {
    console.log(this.creditProposaldata.products);
  }

  // setbidingvalue
  // cekBox
}
