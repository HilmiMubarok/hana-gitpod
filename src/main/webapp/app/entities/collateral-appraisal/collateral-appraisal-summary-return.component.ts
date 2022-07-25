import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-summary-return',
  templateUrl: './collateral-appraisal-summary-return.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalSummaryReturnComponent {
  public tools: object = {
    items: [
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', 'Bold', 'Italic', 'Underline', 'StrikeThrough',
      'SubScript', 'SuperScript', 'Alignments', 'OrderedList', 'UnorderedList',
      'Indent', 'Outdent', 'CreateLink',
      'Image', 'FileManager']
  };
  public filemanager: object = {
    enable: true,
  };

};
