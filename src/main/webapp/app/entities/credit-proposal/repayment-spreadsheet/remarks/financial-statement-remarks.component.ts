import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ICreditProposal } from '../../credit-proposal.model';
import { ToolbarService, DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';

import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';

@Component({
  selector: 'jhi-financial-statement-remarks',
  templateUrl: './financial-statement-remarks.component.html',
  styleUrls: ['./financial-statement-remarks.component.css'],
  providers: [ToolbarService],
})
export class CreditProposalFinancialStatementRemarksComponent {
  public _creditProposalItem: ICreditProposal;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(data: ICreditProposal) {
    this._creditProposalItem = data;
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
