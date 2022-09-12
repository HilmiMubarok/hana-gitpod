import { Component, Input } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-slik-summary',
  templateUrl: './slik-summary.component.html',
  // styleUrls: ['slik.css'],
})
export class SlikSummaryComponent {
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
