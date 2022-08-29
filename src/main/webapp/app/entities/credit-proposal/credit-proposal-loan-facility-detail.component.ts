import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { IApplicationProduct, ApplicationProduct } from '../application-product/application-product.model';

@Component({
  selector: 'jhi-credit-proposal-loan-facility-detail',
  templateUrl: './credit-proposal-loan-facility-detail.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.css'],
})
export class CreditProposalLoanFacilityDetailComponent {
  @Input() public stateOfAction?: string;
  @Input() public creditProposal?: ICreditProposal;

  @Output() outApplicationProduct = new EventEmitter<IApplicationProduct>();

  public applicationProduct?: IApplicationProduct;
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
}
