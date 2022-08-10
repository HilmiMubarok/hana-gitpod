import { Component } from '@angular/core';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-collateral-appraisal-summary-return',
  templateUrl: './collateral-appraisal-summary-return.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalSummaryReturnComponent {
  public tools: ToolbarModule = {
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
