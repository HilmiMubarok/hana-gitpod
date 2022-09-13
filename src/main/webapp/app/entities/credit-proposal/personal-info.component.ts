import { Component, Input } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalPersonalInfoComponent {
  @Input() creditProposalItem: ICreditProposal = new CreditProposal();

  constructor() {
    this.creditProposalItem = new CreditProposal();
  }
}
