import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-busines-activity',
  templateUrl: './credit-proposal-tab-business-activity.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabBusinessActivityComponent implements OnChanges {
  public cifNumber: string;
  public visiblePrompt: Boolean = false;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };
  @Output() outputTeamReviewer = new EventEmitter();
  @Input() creditProposalItem: ICreditProposal = new CreditProposal();
  public item: ICreditProposal = new CreditProposal();
  public visitBy?: string;
  public visitWith?: string;
  public visitDate?: string;
  public positionInCompany?: string;
  public venue?: string;
  public notes = '';

  constructor() {
    this.item = new CreditProposal();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.item = changes.creditProposalItem.currentValue;
    this.visitBy = JSON.parse(changes.creditProposalItem.currentValue.attributes.businesActivity).visitBy;
    this.visitWith = JSON.parse(changes.creditProposalItem.currentValue.attributes.businesActivity).visitWith;
    this.visitDate = JSON.parse(changes.creditProposalItem.currentValue.attributes.businesActivity).visitDate;
    this.positionInCompany = JSON.parse(changes.creditProposalItem.currentValue.attributes.businesActivity).positionInCompany;
    this.venue = JSON.parse(changes.creditProposalItem.currentValue.attributes.businesActivity).venue;
    this.notes = JSON.parse(changes.creditProposalItem.currentValue.attributes.businesActivity).notes;
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

  save() {
    this.creditProposalItem.attributes = {
      businessActivity: JSON.stringify({
        visitBy: this.visitBy,
        visitWith: this.visitWith,
        visitDate: this.visitDate,
        positionInCompany: this.positionInCompany,
        venue: this.venue,
        notes: this.notes,
      }),
    };

    this.outputTeamReviewer.emit(this.creditProposalItem);
  }
}
