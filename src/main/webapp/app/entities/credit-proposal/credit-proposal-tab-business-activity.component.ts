import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-busines-activity',
  templateUrl: './credit-proposal-tab-business-activity.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabBusinessActivityComponent {
  public cifNumber: string;
  public visiblePrompt: Boolean = false;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };
  @Output() outputTeamReviewer = new EventEmitter();
  @Input() creditProposalItem: ICreditProposal;
  public item: ICreditProposal = new CreditProposal();

  constructor() {
    this.item = new CreditProposal();
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

  save() {}
}
