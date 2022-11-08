import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';

@Component({
  selector: 'jhi-credit-proposal-trade-checking-remarks',
  templateUrl: './credit-proposal-trade-checking-remarks.component.html',
  styleUrls: ['../trade-checking.scss'],
})
export class RemarskComponent {
  private _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor(protected creditProposalService: CreditProposalService, protected router: Router) {}
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
      'Outdent',
      'Indent',
      'SuperScript',
      'SubScript',
      'CreateLink',
    ],
  };
}
