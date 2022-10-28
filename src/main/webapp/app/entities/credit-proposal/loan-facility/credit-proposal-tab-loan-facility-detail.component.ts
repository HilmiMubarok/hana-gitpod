import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IApplicationProduct } from '../../application-product/application-product.model';
import { ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail',
  templateUrl: './credit-proposal-tab-loan-facility-detail.component.html',
  styleUrls: ['./grid/loan.scss'],
})
export class CreditProposalTabLoanFacilityDetailComponent {
  public _creditProposal: ICreditProposal;
  public rateAmountTypeList = ['Rate Percentage', 'Amount IDR', 'Amount USD'];

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }
  public applicationProduct: IApplicationProduct;
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

  fungsiSuminit() {
    let result: number;
    let limit: number;
    limit = 0;
    result = 0;
    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.initialLimit !== undefined) {
          if (this._creditProposal.products[i].attributes.currency === 'USD') {
            limit =
              Number(this._creditProposal.products[i].attributes.initialLimit) * Number(this._creditProposal.products[i].attributes.kurs);
            result = result + limit;
          } else {
            result = result + Number(this._creditProposal.products[i].attributes.initialLimit);
          }
        }
      }
    }
    return result;
  }

  fungsiSumchange() {
    let result: number;
    result = 0;
    let change: number;
    change = 0;
    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.changes !== undefined) {
          if (this._creditProposal.products[i].attributes.currency === 'USD') {
            change = Number(this._creditProposal.products[i].attributes.changes) * Number(this._creditProposal.products[i].attributes.kurs);
            result = result + change;
          } else {
            result = result + Number(this._creditProposal.products[i].attributes.changes);
          }
        }
      }
    }
    return result;
  }

  fungsiSumOS() {
    let result: number;
    result = 0;
    let os: number;
    os = 0;
    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.outstanding !== undefined) {
          if (this._creditProposal.products[i].attributes.currency === 'USD') {
            os = Number(this._creditProposal.products[i].attributes.outstanding) * Number(this._creditProposal.products[i].attributes.kurs);
            result = result + os;
          } else {
            result = result + Number(this._creditProposal.products[i].attributes.outstanding);
          }
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
    let plafond: number;
    plafond = 0;
    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.totalPlafond !== undefined) {
          if (this._creditProposal.products[i].attributes.currency === 'USD') {
            plafond =
              Number(this._creditProposal.products[i].attributes.totalPlafond) * Number(this._creditProposal.products[i].attributes.kurs);
            result = result + plafond;
          } else {
            result = result + Number(this._creditProposal.products[i].attributes.totalPlafond);
            // console.log('imi total credit limit', this._creditProposal.products[i].attributes.totalPlafond);
          }
        }
      }
    }

    // console.log('ini total plafond', result);

    return result;
  }

  print() {
    console.log(this._creditProposal);
  }
}
