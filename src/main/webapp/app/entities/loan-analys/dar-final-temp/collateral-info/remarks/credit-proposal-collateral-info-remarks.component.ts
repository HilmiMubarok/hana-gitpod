import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-collateral-info-remarks',
  templateUrl: './credit-proposal-collateral-info-remarks.component.html',
  styleUrls: ['../checklist/credit-proposal-collateral-info-checklist.css'],
})
export class CreditProposalCollateralInfoRemarksComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public remarks: string;
  public newMessage: string;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnInit(): void {
    this.removeTagRemaks();
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

  removeTagRemaks() {
    this.newMessage = this.creditProposal.attributes['collateralChecklist'].remarks;
    this.newMessage = this.newMessage.replace(/<(.|\n)*?>/g, '');
  }
}
