import { Component, EventEmitter, SimpleChanges, Output, Input, OnChanges, OnInit } from '@angular/core';
import { ICreditProposal, CreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationViewComponent {
  private _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public gridCreditProposal: any = [];

  constructor() {}
}
