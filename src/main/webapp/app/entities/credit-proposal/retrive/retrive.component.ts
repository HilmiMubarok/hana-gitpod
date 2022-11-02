import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { retriveDataNew } from './retrive.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import lodash from 'lodash';
import { CreditProposalService } from '../credit-proposal.service';

@Component({
  selector: 'jhi-retrive',
  templateUrl: './retrive.component.html',
  styleUrls: ['./retrive.css'],
})
export class RetriveComponent implements OnInit {
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
  public _creditProposal: ICreditProposal;
  public activeRoute: string;

  @Input()
  get creditProposalItem() {
    return this._creditProposal;
  }

  set creditProposalItem(item: any) {
    this._creditProposal = item;
  }

  constructor(protected creditProposalService: CreditProposalService, protected router: Router) {}
  ngOnInit(): void {
    this.creditProposalItem.attributes['retriveData'].retrive = lodash.clone(this.dataRetrive);
  }

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
