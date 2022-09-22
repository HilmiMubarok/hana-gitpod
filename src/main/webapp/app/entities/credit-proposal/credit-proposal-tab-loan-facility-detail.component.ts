import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { IApplicationProduct } from '../application-product/application-product.model';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail',
  templateUrl: './credit-proposal-tab-loan-facility-detail.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.scss'],
})
export class CreditProposalTabLoanFacilityDetailComponent implements OnInit {

  public applicationProduct?: IApplicationProduct;
  public _creditProposal: ICreditProposal = new CreditProposal();
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

  fungsiSuminit() {
    let result: number;
    result = 0;
    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.initialLimit !== undefined) {
          result = result + Number(this._creditProposal.products[i].attributes.initialLimit);
        }
      }
    }
    return result;
  }

  fungsiSumchange() {
    let result: number;
    result = 0;
    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.changes !== undefined) {
          result = result + Number(this._creditProposal.products[i].attributes.changes);
        }
      }
    }
    return result;
  }

  fungsiSumOS() {
    let result: number;
    result = 0;
    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.outstanding !== undefined) {
          result = result + Number(this._creditProposal.products[i].attributes.outstanding);
        }
      }
    }
    return result;
  }

  fungsiSumavailable() {
    let result: number;
    result = 0;
    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.availableLimit !== undefined) {
          result = result + Number(this._creditProposal.products[i].attributes.availableLimit);
        }
      }
    }
    return result;
  }

  fungsiSumcredit() {
    let result: number;
    result = 0;
    result = this.fungsiSumchange() + this.fungsiSuminit();
    return result;
  }

  print() {
    console.log(this._creditProposal);
  }
}
