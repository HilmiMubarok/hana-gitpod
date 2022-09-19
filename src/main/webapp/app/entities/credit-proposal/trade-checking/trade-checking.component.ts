import { Component, Input } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-trade-checking',
  templateUrl: './trade-checking.component.html',
  styleUrls: ['./trade-checking.scss'],
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
