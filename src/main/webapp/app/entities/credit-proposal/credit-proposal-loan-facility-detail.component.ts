import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { IApplicationProduct, ApplicationProduct } from '../application-product/application-product.model';

@Component({
  selector: 'jhi-credit-proposal-loan-facility-detail',
  templateUrl: './credit-proposal-loan-facility-detail.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.scss'],
})
export class CreditProposalLoanFacilityDetailComponent implements OnChanges {
  private _applicationProduct: IApplicationProduct;

  @Input()
  get applicationProduct() {
    return this._applicationProduct;
  }
  set applicationProduct(data: IApplicationProduct) {
    this._applicationProduct = data;
  }

  @Input() public stateOfAction?: string;
  @Input() public creditProposal?: ICreditProposal;

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

    rateAmountTypeList: ['Rate Percentage', 'Amount IDR', 'Amount USD'],
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
    if (this.applicationProduct.attributes.facilityType === 'FN - Syndicate loan / club deal') {
      this.status = true;
      this.unComitted = true;
      this.hidden = true;
    } else {
      this.hidden = false;
      this.status = false;
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
    console.log('henshin');
  }

  // henshin
  berubah(event: any): void {
    console.log(event);
    if (event.value === 'FN - Syndicate loan / club deal') {
      console.log('syndicate terpilih');
      this.status = true;
    } else {
      this.status = false;
    }
  }

  changeIntRateType(event: any): void {
    if (event.value === 'JIBOR' || event.value === 'BSBY' || event.value === 'TERM') {
      this.statIntRate = false;
    } else {
      this.statIntRate = true;
    }
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
