import { Component, Input } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail',
  templateUrl: './credit-proposal-tab-loan-facility-detail.component.html',
  styleUrls: ['./credit-proposal-tab-loan-facility-detail.css'],
})
export class CreditProposalTabLoanFacilityDetailComponent {
  private _creditProposal: ICreditProposal = new CreditProposal();

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
  };
}
