import { Component, Input, OnInit } from '@angular/core';
import { ItemsDirective } from '@syncfusion/ej2-angular-navigations';
import { retriveDataNew } from './retrive.constant';
import { Router } from '@angular/router';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import lodash from 'lodash';
import { CreditProposalService } from '../credit-proposal.service';

@Component({
  selector: 'jhi-retrive',
  templateUrl: './retrive.component.html',
  styleUrls: ['./retrive.css'],
})
export class RetriveComponent {
  public displayColumns: string[] = ['year', 'amountcode', 'accountname', 'currency', 'amount1'];
  public listOfValue = {
    currencyList: ['USD', 'IDR'],
  };
  public showHide = false;
  public getMenu: string;
  selected;
  currencies: any;

  usd_default = 15.4;

  public dataRetrive = retriveDataNew;
  public activeRoute: string;
  public _creditProposalItem: ICreditProposal;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(protected creditProposalService: CreditProposalService) {}

  // currency convert
  convertCurrency(value: string) {
    if (value === 'USD') {
      retriveDataNew.filter(function (e) {
        e.ccy = value;
      });
      retriveDataNew.filter(item => {
        item.amount = item.amount / this.usd_default;
      });
    } else if (value === 'IDR') {
      retriveDataNew.filter(function (e) {
        e.ccy = value;
      });
      retriveDataNew.filter(item => {
        item.amount = item.amount * this.usd_default;
      });
    }
  }
}
