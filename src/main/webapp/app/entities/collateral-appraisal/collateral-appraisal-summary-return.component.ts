import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-summary-return',
  templateUrl: './collateral-appraisal-summary-return.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalSummaryReturnComponent {
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
