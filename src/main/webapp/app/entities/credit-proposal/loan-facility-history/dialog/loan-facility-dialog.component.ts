import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import lodash from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { IndexRateService } from '../../index-rate.service';

@Component({
  selector: 'jhi-loan-facility-dialog-history',
  templateUrl: './loan-facility-dialog.component.html',
  styleUrls: ['./dialog-facility.css'],
})
export class CreditProposalLoanFacilityDialogHistoryComponent extends AbstractEntityBaseViewComponent<ICreditProposal> implements OnInit {
  private _collateral: ICollateral;
  private _creditproposal: ICreditProposal;
  public dataItem: ICreditProposal;
  public indexRate: string;
  public ccy: string;
  public rateType: string;
  public dateIndex: number;
  public facilityType: string;
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
  private creditProposalData: ICreditProposal;
  selection = true;
  // dataProductId: any;
  public setDate: string;
  public currencyName: number;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICreditProposal;
      applicationProduct: IApplicationProduct;
      collateralInfo: any;
      collateralProductRelations: any;
      creditProposaldata: ICreditProposal;
    },
    public indexRateService: IndexRateService,
    public creditProposalService: CreditProposalService,
    private _dialog: MatDialogRef<CreditProposalLoanFacilityDialogHistoryComponent>
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
  // public typeListControl = new FormControl(this.listOfValue.applicationTypeList['New']);
  ngOnInit(): void {
    this.getLovSublimit();
    this.lovIndex = this.lovSublimit.filter(obj => obj.label === this.applicationProduct.attributes['sublimitFromExistingFacility']);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.disableButtonChange(this.applicationProduct.attributes['facilityType']);
    this.chnageCurrency(this.applicationProduct.attributes['currency']);

    // this.typeListControl;
  }

  public save(): void {
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
      if (this.rateType !== '' && this.ccy !== '' && this.dateIndex !== 0) {
        this.indexRateService
          .find('get?date=' + this.dateIndex + '&ccy=' + this.ccy + '&rateType=' + this.rateType)
          .subscribe((res: any) => {
            for (let i = 1; i < 13; i++) {
              if (i === this.dateIndex) {
                this.indexRate = res.body['rate' + i + 'M'];
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

    this.facilityType = event;

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

  // public changeCcy(event: string) {
  //   if (this.preCurent === '') {
  //     if (event === 'IDR') {
  //       this.conCcy = true;
  //       this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  //       this.preCurent = 'IDR';
  //     } else if (event === 'USD') {
  //       this.conCcy = true;
  //       this.logoCcy = {};
  //       this.preCurent = 'USD';
  //     }
  //   } else if (this.preCurent === 'IDR') {
  //     if (event === '') {
  //       this.conCcy = false;
  //       this.preCurent = '';
  //     } else if (event === 'USD') {
  //       this.conCcy = true;
  //       this.logoCcy = {};
  //       this.applicationProduct.attributes['initialLimit'] =
  //         this.applicationProduct.attributes['initialLimit'] / this.applicationProduct.attributes['kurs'];
  //       this.applicationProduct.attributes['outstanding'] =
  //         this.applicationProduct.attributes['outstanding'] / this.applicationProduct.attributes['kurs'];
  //       this.applicationProduct.attributes['changes'] =
  //         this.applicationProduct.attributes['changes'] / this.applicationProduct.attributes['kurs'];
  //       this.preCurent = 'USD';
  //     }
  //   } else if (this.preCurent === 'USD') {
  //     if (event === '') {
  //       this.conCcy = false;
  //       this.preCurent = '';
  //     } else if (event === 'IDR') {
  //       this.conCcy = true;
  //       this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  //       this.applicationProduct.attributes['initialLimit'] =
  //         this.applicationProduct.attributes['initialLimit'] * this.applicationProduct.attributes['kurs'];
  //       this.applicationProduct.attributes['outstanding'] =
  //         this.applicationProduct.attributes['outstanding'] * this.applicationProduct.attributes['kurs'];
  //       this.applicationProduct.attributes['changes'] =
  //         this.applicationProduct.attributes['changes'] * this.applicationProduct.attributes['kurs'];
  //       this.preCurent = 'IDR';
  //     }
  //   }
  // }

  public print() {
    console.log(this.creditProposalData.products);
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
  // remove mask
  removeSymbolCcy(node) {
    this.fee = document.querySelectorAll('.fee');
    let ccy = node.innerHTML;
    ccy = ccy.replace(/\$ /g, '');
    node.innerHTML = this.fee;
  }
}
