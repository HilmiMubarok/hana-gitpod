import { Component, Input } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-trade-checking',
  templateUrl: './credit-proposal-trade-checking.component.html',
  styleUrls: ['../Trade-Checking/trade-checking.scss'],
})
export class TradeCheckingComponent {
  private _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }

  constructor() {}
}
