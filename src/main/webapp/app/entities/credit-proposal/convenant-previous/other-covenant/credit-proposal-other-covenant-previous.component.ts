import { Component, Input, OnInit } from '@angular/core';
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

  ngOnInit() {
    // if previousReturn attribute exists
    if (this.creditProposalItem.attributes['previousReturn']) {
      this.dataSource = this.creditProposalItem.attributes['previousReturn']['convenant']['otherCovenant'];
    } else {
      this.dataSource = [];
    }
    this.isOtherDeviation && this.displayColumns.pop();
    this.isOtherDeviation && this.filterOtherDeviation();
  }

  @Input() isOtherDeviation: Boolean = false;

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
      if (this.creditProposalItem.attributes['previousReturn'].convenant.otherCovenant.length !== 0) {
        this.otherDeviation = this.creditProposalItem.attributes['previousReturn'].convenant.otherCovenant.filter(
          element => element.status !== 'Applied'
        );
      }
    } else if (this.isOffering) {
      if (this.creditProposalItem.attributes['previousHistory'].convenant.otherCovenant.length !== 0) {
        this.otherDeviation = this.creditProposalItem.attributes['previousHistory'].convenant.otherCovenant.filter(
          element => element.status !== 'Applied'
        );
      }
    }
  }

  public displayColumns: string[] = ['no', 'covenant', 'status', 'deviation'];

  constructor() {}
}
