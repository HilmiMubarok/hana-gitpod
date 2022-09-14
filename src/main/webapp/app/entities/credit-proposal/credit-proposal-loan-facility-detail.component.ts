import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { IApplicationProduct, ApplicationProduct } from '../application-product/application-product.model';

@Component({
  selector: 'jhi-credit-proposal-loan-facility-detail',
  templateUrl: './credit-proposal-loan-facility-detail.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.css'],
})
export class CreditProposalLoanFacilityDetailComponent implements OnChanges {
  @Input() public stateOfAction?: string;
  @Input() public renday?: string;
  @Input() public creditProposal?: ICreditProposal;
  @Input() public dataEdit?: IApplicationProduct;

  @Output() outApplicationProduct = new EventEmitter<IApplicationProduct>();

  public applicationProduct?: IApplicationProduct;
  public status = false;
  public hidden = false;
  public listOfValue = {
    applicationTypeList: ['New', 'Additional / Top Up', 'Renewal', 'Restructure', 'No Changes', 'Others'],
    facilityTypeList: ['OD', 'WCI', 'DL', 'MML', 'FL', 'TR', 'E-ARC', 'IL', 'BG', 'LC', 'FN - Syndicate loan / club deal'],
    periodTypeList: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    sublimitFromExistingFacilityList: [],
    currencyList: ['IDR', 'USD'],
    interestRateTypeList: ['Fixed', 'Tidak Ada', 'Variable'],
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
    console.log("ini data dari mata", this.dataEdit.attributes);
    console.log("init nih");

    if(this.dataEdit.attributes.facilityType === "FN - Syndicate loan / club deal"){
      console.log("syndicate terpilih");
      this.status = true;
    } else{
      this.status = false;
    }

    if(this.stateOfAction === "edit"){
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
        memoNo: this.dataEdit.attributes.memoNo,
        memoDate: this.dataEdit.attributes.memoDate,
        keterangan: this.dataEdit.attributes.keterangan,
        interestRateType: this.dataEdit.attributes.interestRateType,
        interestRatePeriodType: this.dataEdit.attributes.interestRatePeriodType,
        indexRate: this.dataEdit.attributes.indexRate,
        spreadOfMargin: this.dataEdit.attributes.spreadOfMargin,
        totalRate: this.dataEdit.attributes.totalRate,
        provitionFee: this.dataEdit.attributes.provitionFee,
        provitionFeeRateAmountType: this.dataEdit.attributes.provitionFeeRateAmountType,
        adminFee: this.dataEdit.attributes.adminFee,
        adminFeeRateAmountType: this.dataEdit.attributes.adminFeeRateAmountType,
        gracePeriod: this.dataEdit.attributes.gracePeriod,
        gracePeriodType: this.dataEdit.attributes.gracePeriod,
        availableLimit: this.dataEdit.attributes.availableLimit,
        availablePeriod: this.dataEdit.attributes.availablePeriod,
        availablePeriodType: this.dataEdit.attributes.availableLimit,
        instalmentEstimation: this.dataEdit.attributes.instalmentEstimation,
        principalFrequency: this.dataEdit.attributes.principalFrequency,
        principalFrequencyPeriodType: this.dataEdit.attributes.principalFrequencyPeriodType,
        loanPurpose: this.dataEdit.attributes.loanPurpose,
        remark: this.dataEdit.attributes.remark,
      };
    } else if(this.stateOfAction === "add") {
      this.initialize();
    }

    if(this.applicationProduct.attributes.facilityType === 'FN - Syndicate loan / club deal'){
      this.hidden = true;
    }else{
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
    this.applicationProduct = new ApplicationProduct();

    this.applicationProduct.attributes = {
      nomorUrutFasilitas: '',
      applicationType: '',
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
      totalPlafond: 0,
      restructuredStatus: false,
      memoNo: '',
      memoDate: new Date(),
      keterangan: '',
      interestRateType: '',
      interestRatePeriodType: '',
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
    };
    
  }

  public onAdd(): void {
    this.outApplicationProduct.emit(this.applicationProduct);
    this.initialize();
  }

  berubah(event){
    console.log(event);
    if(event.value === "FN - Syndicate loan / club deal"){
      console.log("syndicate terpilih");
      this.status = true;
    } else{
      this.status = false;
    }
  }
}
