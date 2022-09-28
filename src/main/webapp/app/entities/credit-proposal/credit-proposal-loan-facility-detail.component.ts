import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { IApplicationProduct, ApplicationProduct } from '../application-product/application-product.model';

@Component({
  selector: 'jhi-credit-proposal-loan-facility-detail',
  templateUrl: './credit-proposal-loan-facility-detail.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.scss'],
})
export class CreditProposalLoanFacilityDetailComponent implements OnChanges {
  @Input() public stateOfAction?: string;
  @Input() public creditProposal?: ICreditProposal;
  @Input() public dataEdit?: IApplicationProduct;
  @Input() public indexing?: number;

  @Output() outApplicationProduct = new EventEmitter<IApplicationProduct>();

  public applicationProduct?: IApplicationProduct;
  public unComitted = true;
  public statIntRate = true;
  public status = false;
  public hidden = false;
  public index = 1;
  public detailStats = false;
  public totalPlafond = 0;

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
    interestRateTypeList: ['FIXED', 'LIBOR', 'JIBOR', 'TIBOR', 'HIBOR', 'EURIBOR', 'EURO-LIBOR', 'FED FUND', 'OTHER', 'BSBY', 'TERM SOFR'],

    rateAmountTypeList: ['Rate Percentage', 'Amount'],
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

  constructor() {
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['creditProposal']) {
    //   if(this.creditProposal.products.length > 0){
    //     for(let i = 0; i < this.index; i++){
    //       if(Number(this.creditProposal.products[i].attributes.nomorUrutFasilitas) === this.index){
    //         this.index++;
    //         console.log("data ", this.index, "Found");
    //       }
    //     }
    //   }
    //   this.initialize();
    // }

    if (changes['creditProposal']) {
      if (this.creditProposal.products.length > 0) {
        for (let i = 0; i < this.creditProposal.products.length; i++) {
          if (this.creditProposal.products[i] === this.index) {
            this.index++;
          } else {
            break;
          }
        }
      }

      this.index = this.creditProposal.products.length + 1;
      console.log(this.index);
      if (this.stateOfAction === 'add') {
        this.initialize();
      }
    }

    if (this.dataEdit.attributes.facilityType === 'FN - Syndicate loan / club deal') {
      console.log('syndicate terpilih');
      this.status = true;
      this.unComitted = true;
    } else {
      this.status = false;
    }

    if (this.stateOfAction === 'edit') {
      this.unComitted = this.dataEdit.attributes.commitedLine;
      this.detailStats = false;
      this.applicationProduct.attributes = {
        nomorUrutFasilitas: this.dataEdit.attributes.nomorUrutFasilitas,
        applicationType: this.dataEdit.attributes.applicationType,
        facilityType: this.dataEdit.attributes.facilityType,
        maturity: this.dataEdit.attributes.maturity,
        maturityPeriodType: this.dataEdit.attributes.maturityPeriodType,
        maturityDate: this.dataEdit.attributes.maturityDate,
        subLimit: this.dataEdit.attributes.subLimit,
        sublimitFromExistingFacility: this.dataEdit.attributes.sublimitFromExistingFacilit,
        commitedLine: this.dataEdit.attributes.commitedLine,
        currency: this.dataEdit.attributes.currency,
        kurs: this.dataEdit.attributes.kurs,
        initialLimit: this.dataEdit.attributes.initialLimit,
        outstanding: this.dataEdit.attributes.outstanding,
        dateOS: this.dataEdit.attributes.dateOS,
        changes: this.dataEdit.attributes.changes,
        totalPlafond: this.dataEdit.attributes.totalPlafond,
        restructuredStatus: this.dataEdit.attributes.restructuredStatus,
        restructMethod: this.dataEdit.attributes.restructMethod,
        memoNo: this.dataEdit.attributes.memoNo,
        memoDate: this.dataEdit.attributes.memoDate,
        keterangan: this.dataEdit.attributes.keterangan,
        interestRateType: this.dataEdit.attributes.interestRateType,
        interestRatePeriod: this.dataEdit.attributes.interestRatePeriod,
        interestRatePeriodType: this.dataEdit.attributes.interestRatePeriodType,
        indexRate: this.dataEdit.attributes.indexRate,
        spreadOfMargin: this.dataEdit.attributes.spreadOfMargin,
        totalRate: this.dataEdit.attributes.totalRate,
        provitionFee: this.dataEdit.attributes.provitionFee,
        provitionFeeRateAmountType: this.dataEdit.attributes.provitionFeeRateAmountType,
        adminFee: this.dataEdit.attributes.adminFee,
        adminFeeRateAmountType: this.dataEdit.attributes.adminFeeRateAmountType,
        gracePeriod: this.dataEdit.attributes.gracePeriod,
        gracePeriodType: this.dataEdit.attributes.gracePeriodType,
        availableLimit: this.dataEdit.attributes.availableLimit,
        availablePeriod: this.dataEdit.attributes.availablePeriod,
        availablePeriodType: this.dataEdit.attributes.availablePeriodType,
        instalmentEstimation: this.dataEdit.attributes.instalmentEstimation,
        principalFrequency: this.dataEdit.attributes.principalFrequency,
        principalFrequencyPeriodType: this.dataEdit.attributes.principalFrequencyPeriodType,
        loanPurpose: this.dataEdit.attributes.loanPurpose,
        remark: this.dataEdit.attributes.remark,
        subLimitFromExitingFacility: '',
      };
    } else if (this.stateOfAction === 'add') {
      this.detailStats = false;
      this.initialize();
    }

    if (this.applicationProduct.attributes.facilityType === 'FN - Syndicate loan / club deal') {
      this.hidden = true;
    } else {
      this.hidden = false;
    }
  }

  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
  };

  private initialize(): void {
    console.log(this.indexing);

    this.applicationProduct = new ApplicationProduct();

    this.applicationProduct.attributes = {
      nomorUrutFasilitas: this.index,
      applicationType: 'Existing',
      facilityType: '',
      maturity: 0,
      maturityPeriodType: '',
      maturityDate: new Date(),
      subLimit: false,
      sublimitFromExistingFacility: '',
      commitedLine: false,
      currency: '',
      kurs: 0,
      initialLimit: 0,
      outstanding: 0,
      dateOS: new Date(),
      changes: 0,
      totalPlafond: this.totalPlafond,
      restructuredStatus: false,
      restructMethod: '',
      memoNo: '',
      memoDate: new Date(),
      keterangan: '',
      interestRateType: '',
      interestRatePeriod: '',
      interestRatePeriodType: 'Month',
      indexRate: 0,
      spreadOfMargin: 0,
      totalRate: 0,
      provitionFee: 0,
      provitionFeeRateAmountType: '',
      adminFee: 0,
      adminFeeRateAmountType: '',
      gracePeriod: 0,
      gracePeriodType: '',
      availableLimit: 0,
      availablePeriod: '',
      availablePeriodType: '',
      instalmentEstimation: 0,
      principalFrequency: 0,
      principalFrequencyPeriodType: '',
      loanPurpose: '',
      remark: '',
      subLimitFromExitingFacility: '',
    };
  }

  public onAdd(): void {
    // for(let i = 0; i < this.creditProposal.products.length;){
    //   if(this.creditProposal.products[i].attributes[i]. === this.index){
    //     i ++;
    //   }else{
    //     this.index = i +1;
    //     break;
    //   }
    // }
    this.outApplicationProduct.emit(this.applicationProduct);
    this.initialize();
  }

  berubah(event) {
    console.log(event);
    if (event.value === 'FN - Syndicate loan / club deal') {
      console.log('syndicate terpilih');
      this.status = true;
    } else {
      this.status = false;
    }
  }

  changeIntRateType(event) {
    if (event.value === 'JIBOR' || event.value === 'BSBY' || event.value === 'TERM') {
      this.statIntRate = false;
    } else {
      this.statIntRate = true;
    }
    console.log(event.value);
  }

  calTotalPlafond() {
    this.applicationProduct.attributes.totalPlafond =
      Number(this.applicationProduct.attributes.initialLimit) + Number(this.applicationProduct.attributes.changes);
    return Number(this.applicationProduct.attributes.initialLimit) + Number(this.applicationProduct.attributes.changes);
  }

  print() {
    console.log(this.index);
  }
}
