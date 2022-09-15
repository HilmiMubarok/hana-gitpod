import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-credit-proposal-propose-pricing',
  templateUrl: './credit-proposal-propose-pricing.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalProposePricingComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  public selectedMenu: string;
  @Output() outCreditProposal = new EventEmitter<ICreditProposal>();
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;
    this.outCreditProposal.emit(this.creditProposal);
  }

  public menuItems: MenuItemModel[] = [{ text: 'CALCULATOR' }, { text: 'DASHBOARD' }];

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  ngOnInit(): void {
    this.selectedMenu = 'CALCULATOR';
  }
}
