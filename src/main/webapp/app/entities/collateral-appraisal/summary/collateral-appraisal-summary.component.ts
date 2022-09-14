import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-collateral-appraisal-summary',
  templateUrl: './collateral-appraisal-summary.component.html',
  styleUrls: ['./collateral-appraisal-summary.css'],
})
/* export class CollateralAppraisalSummaryComponent implements OnInit { */
export class CollateralAppraisalSummaryComponent {
  private _item: ICreditProposal;

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  /* ngOnInit() {
    this.item['attributes'] = {
      ...this.item['attributes'],
      summary: {
        keterangan: this.item['attributes'].summary === undefined ? '' : JSON.parse(this.item['attributes'].summary).keterangan,
        marketbility: this.item['attributes'].summary === undefined ? '' : JSON.parse(this.item['attributes'].summary).marketbility,
        returnNotes: this.item['attributes'].summary === undefined ? '' : JSON.parse(this.item['attributes'].summary).returnNotes,
      },
    };
  } */

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