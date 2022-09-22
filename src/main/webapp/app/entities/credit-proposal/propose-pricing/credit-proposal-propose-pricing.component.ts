import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-credit-proposal-propose-pricing',
  templateUrl: './credit-proposal-propose-pricing.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalProposePricingComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public selectedMenu: string;
  public availabelLimitArray = [];
  public OSArray = [];
  public plafontArray = [];
  public countOS: number;
  public availableLimit: number;
  public totalPlafon: number;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  constructor() {
    this.countOS = 0;
    this.availableLimit = 0;
    this.totalPlafon = 0;
  }

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;

    this.setValue(creditProposal);
  }

  setValue(creditProposal: any) {
    for (let i = 0; i < creditProposal.products.length; i++) {
      if (creditProposal.products[i].attributes.availableLimit !== undefined) {
        this.availabelLimitArray.push(creditProposal.products[i].attributes.availableLimit);
      } else {
        this.availabelLimitArray = [];
      }

      if (creditProposal.products[i].attributes.os !== undefined) {
        this.OSArray.push(creditProposal.products[i].attributes.os);
      } else {
        this.OSArray = [];
      }

      if (creditProposal.products[i].attributes.totalPlafond !== undefined) {
        this.plafontArray.push(creditProposal.products[i].attributes.totalPlafond);
      } else {
        this.plafontArray = [];
      }
    }

    this.availableLimit = this.availabelLimitArray.reduce((a, b) => Number(a) + Number(b));
    this.countOS = this.OSArray.reduce((a, b) => Number(a) + Number(b));
    this.totalPlafon = this.plafontArray.reduce((a, b) => Number(a) + Number(b));
  }

  public menuItems: MenuItemModel[] = [{ text: 'CALCULATOR' }, { text: 'DASHBOARD' }];

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  ngOnInit(): void {
    this.selectedMenu = 'CALCULATOR';
    if (this.creditProposal.products.length > 1) {
      this.setValue(this.creditProposal);
    }
  }
}
