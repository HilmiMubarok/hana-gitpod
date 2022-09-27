import { Component, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
// cek
import { ToolbarService, DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';
// import { TitleBar } from './title-bar';

// import { defaultDocument, WEB_API_ACTION } from './data';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

@Component({
  selector: 'jhi-credit-proposal-group-guarantor-analysis',
  templateUrl: './credit-proposal-group-guarantor-analysis.component.html',
  styleUrls: ['./credit-proposal-group-guarantor-analysis.component.css'],
  providers: [ToolbarService],
})
export class CreditProposalGroupGuarantorAnalysisComponent {
  private _creditProposalItem: ICreditProposal;



  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(data: ICreditProposal) {
    this._creditProposalItem = data;
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
      'Outdent',
      'Indent',
      'SuperScript',
      'SubScript',
      'CreateLink',
    ],
  };
}
