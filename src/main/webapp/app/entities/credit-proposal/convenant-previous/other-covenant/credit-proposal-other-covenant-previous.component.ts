import { Component, Input } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-other-covenant-previous',
  templateUrl: './credit-proposal-other-covenant-previous.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class CreditProposalOtherCovenantPreviousComponent {
  public _creditProposalItem: ICreditProposal;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public displayColumns: string[] = ['no', 'covenant', 'status', 'deviation'];

  constructor() {}
}
