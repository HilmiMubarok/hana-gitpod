import { Component, Input, OnInit } from '@angular/core';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-other-covenant-previous',
  templateUrl: './credit-proposal-other-covenant-previous.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class CreditProposalOtherCovenantPreviousComponent implements OnInit {
  public _creditProposalItem: ICreditProposal;
  public otherDeviation: any;
  public dataSource: any;
  public dataPrevious;

  ngOnInit() {
    // if previousReturn attribute exists
    if (this.creditProposalItem.attributes['previousReturn']) {
      this.dataPrevious = parsePreviousAtrribute(this.creditProposalItem);
      this.dataSource = this.dataPrevious.previousReturn.convenant.otherCovenant;
    } else {
      this.dataSource = [];
    }
    this.isOtherDeviation && this.displayColumns.pop();
    this.isOtherDeviation && this.filterOtherDeviation();
  }

  @Input() isOtherDeviation: Boolean;

  @Input() isOffering: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public filterOtherDeviation() {
    // if previousReturn attribute exists
    if (this.creditProposalItem.attributes['previousReturn'] && !this.isOffering) {
      if (this.dataPrevious.previousReturn.convenant.otherCovenant.length !== 0) {
        this.otherDeviation = this.dataPrevious.previousReturn.convenant.otherCovenant.filter(element => element.status !== 'Applied');
      }
    } else if (this.isOffering) {
      if (this.dataPrevious.previousHistory.convenant.otherCovenant.length !== 0) {
        this.otherDeviation = this.dataPrevious.previousHistory.convenant.otherCovenant.filter(element => element.status !== 'Applied');
      }
    }
  }

  public displayColumns: string[] = ['no', 'covenant', 'status', 'deviation', 'justification'];

  constructor() {}
}
