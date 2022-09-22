import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-tab-summary',
  templateUrl: './credit-proposal-tab-summary.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabSummaryComponent {
  public state: string;
  public dialogVisible: false;
  public data: object[];

  public _item?: ICreditProposal = new CreditProposal();

  constructor(protected reportUtils: ReportUtilService) {}

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  attributes: any;

  public generate(data: any): void {
    this.state = 'idle';
    this.dialogVisible = false;
    this.print();
  }

  print() {
    this.reportUtils.viewFile('/services/report/api/report/credit-proposal/pdf', { id: this._item.id.toString });
  }
}
