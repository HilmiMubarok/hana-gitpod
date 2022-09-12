import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-tab-exposure',
  templateUrl: './credit-proposal-tab-exposure.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabExposureComponent implements OnChanges {
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
  public _item: ICreditProposal = new CreditProposal();
  public dataGrid: any = [];

  public _creditProposal: ICreditProposal;
  public itemCollateral: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fungsiSuminit();
    this.fungsiSumchange();
    this.fungsiSumOS();
    this.fungsiSumavailable();
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

  print() {
    console.log('item nih', this._creditProposal);
  }
}
