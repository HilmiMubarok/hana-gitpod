import { Component } from '@angular/core';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-collateral-appraisal-summary',
  templateUrl: './collateral-appraisal-summary.component.html',
  styleUrls: ['./collateral-appraisal-summary.css'],
})
export class CollateralAppraisalSummaryComponent {
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
      'Outdent',
      'Indent',
      'SuperScript',
      'SubScript',
      'CreateLink',
    ],
  };
}
