import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-summary-return',
  templateUrl: './collateral-appraisal-summary-return.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalSummaryReturnComponent {
  public tools: object = {
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|',
      'Undo', 'Redo', '|', 'FullScreen', '|', 'FileManager' ]
  };
};
