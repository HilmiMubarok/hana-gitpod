import { Component, Input } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-busines-activity',
  templateUrl: './credit-proposal-tab-business-activity.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabBusinessActivityComponent {
  private _creditProposalItem: ICreditProposal;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }
  set creditProposalItem(data: ICreditProposal) {
    this._creditProposalItem = data;
  }

  constructor() {}

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
