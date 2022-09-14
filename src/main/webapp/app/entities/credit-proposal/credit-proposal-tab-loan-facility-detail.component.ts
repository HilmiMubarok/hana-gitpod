import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { IApplicationProduct } from '../application-product/application-product.model';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail',
  templateUrl: './credit-proposal-tab-loan-facility-detail.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.css'],
})
export class CreditProposalTabLoanFacilityDetailComponent implements OnInit, OnChanges{

  public applicationProduct?: IApplicationProduct;
  private _creditProposal: ICreditProposal = new CreditProposal();
  public totalInitialLimit?: number;
  public totalChanges?: number;
  public totalAvailableLimit?: number;
  public totalOS?: number;
  public totalCreditLimit?: number;
  public init = 0;
  public init2 = 0;
  public change = 0;
  public os = 0;
  public credit = 0;
  public available = 0;
  public totallimt = 0;
  public totalos = 0;
  public totalchange = 0;
  public totalcredit = 0;
  public totalavilable = 0;
  public change2 = 0;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Output() outCreditProposal = new EventEmitter<ICreditProposal>();

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;
    this.outCreditProposal.emit(this._creditProposal);
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

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fungsiSuminit();
    this.fungsiSumchange();
    this.fungsiSumOS();
    this.fungsiSumcredit();
    // this.fungsiSuminit2();
    this.fungsiSumavailable();
    // this.fungsiSumTotallimit();
    // this.fungsiSumTotaltotalchange();
    // this.fungsiSumTotaltotalcredit();
    // this.fungsiSumTotaltotalos();
  }

  fungsiSuminit() {
    for (let i = 0; i < this._creditProposal.products.length; i++) {
      if (this._creditProposal.products[i].attributes.initialLimit === undefined) {
        console.log('masuk limit');
        console.log('initial limit', this._creditProposal.products[i].attributes.initialLimit);
      } else {
        this.init = this.init + Number(this._creditProposal.products[i].attributes.initialLimit);
        console.log('ada limit');
        console.log('initial limit', this._creditProposal.products[i].attributes.initialLimit);
      }
    }
  }
  fungsiSumchange() {
    for (let i = 0; i < this._creditProposal.products.length; i++) {
      if (this._creditProposal.products[i].attributes.changes === undefined) {
        console.log('masuk');
      } else {
        this.change = this.change + Number(this._creditProposal.products[i].attributes.changes);
        console.log(this._creditProposal.products[i].attributes.changes);
      }
    }
  }
  fungsiSumOS() {
    for (let i = 0; i < this._creditProposal.products.length; i++) {
      if (this._creditProposal.products[i].attributes.outstanding === undefined) {
        console.log('masuk');
      } else {
        this.os = this.os + Number(this._creditProposal.products[i].attributes.outstanding);
        console.log(this._creditProposal.products[i].attributes.outstanding);
      }
    }
  }
  fungsiSumavailable() {
    for (let i = 0; i < this._creditProposal.products.length; i++) {
      if (this._creditProposal.products[i].attributes.availableLimit === undefined) {
        console.log('tidak masuk available');
      } else {
        this.available = this.available + Number(this._creditProposal.products[i].attributes.availableLimit);
        console.log('ada available');
        console.log(this._creditProposal.products[i].attributes.availableLimit);
      }
    }
  }
  fungsiSumcredit() {
    this.totalcredit =  this.change + this.init;
  }

  print(){
    console.log(this._creditProposal);
  }
}
