import { Component, Input } from '@angular/core';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { ICollateralAppraisal } from '../collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-appraisal-summary',
  templateUrl: './collateral-appraisal-summary.component.html',
  styleUrls: ['./collateral-appraisal-summary.css']
})
export class CollateralAppraisalSummaryComponent {
  @Input() collateralAppraisal: ICollateralAppraisal;
  private _item: ICreditProposal;
  public formatType?: string;

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  constructor(protected reportUtils: ReportUtilService) {}

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
      'CreateLink'
    ]
  };

  public listOfValue = { formatType: ['Word', 'Pdf'] };

  public generate(type?: string): void {
    this.print(type);
  }

  print(type?: string) {
    const id = this.item.id;
    if (this.formatType === 'Word') {
      this.reportUtils.downloadFile2('/services/report/api/report/survey-appraisal/word-stream/' + id, '', 'Report_' + id);
    } else if (this.formatType === 'Pdf') {
      this.reportUtils.viewFile('/services/report/api/report/survey-appraisal/pdf-word-stream/' + id);
    }
  }
}