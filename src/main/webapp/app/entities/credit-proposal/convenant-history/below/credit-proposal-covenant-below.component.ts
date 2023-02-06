import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow } from '../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
@Component({
  selector: 'jhi-credit-proposal-tab-covenant-below-history',
  templateUrl: './credit-proposal-covenant-below.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalCovenantBelowHistoryComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardCovenant: any = dataCovenantBelow;

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];
  public parseAttr: any;

  @Input() isViewMode: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this.parseAttr = parsePreviousAtrribute(item);
    this._creditProposalItem = item;
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardCovenant.length; i++) {
      if (i === Number(data.index)) {
        this.standardCovenant[i].status = input === 'status' ? event.value : this.standardCovenant[i].status;
        this.standardCovenant[i].deviation = input === 'deviation' ? event.target.value : this.standardCovenant[i].deviation;
        this.standardCovenant[i].justification = input === 'justification' ? event.target.value : this.standardCovenant[i].justification;
      } else {
        this.standardCovenant[i].status = this.statusValue[i];
        this.standardCovenant[i].deviation = this.deviation[i];
        this.standardCovenant[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardCovenant = lodash.clone(this.standardCovenant);
  }

  public historyData() {
    this.parseAttr = parsePreviousAtrribute(this.creditProposalItem);
    if (this.isOnCompareData) {
      if (this.isCompareDar) {
        // compare dar not done yet
        return this.creditProposalItem.attributes;
      } else {
        if (this.creditProposalItem.attributes.previousReturn) {
          return this.parseAttr.previousReturn;
        } else {
          return this.parseAttr.previousHistory;
        }
      }
    } else {
      if (this.creditProposalItem.attributes.previousReturn) {
        return this.parseAttr.previousReturn;
      } else {
        return this.parseAttr.previousHistory;
      }
    }
  }

  ngOnInit(): void {
    if (this.historyData().convenant.standardCovenant.length !== 0) {
      for (let i = 0; i < this.historyData().convenant.standardCovenant.length; i++) {
        this.statusValue[i] = this.historyData().convenant.standardCovenant[i].status;
        this.deviation[i] = this.historyData().convenant.standardCovenant[i].deviation;
        this.justification[i] = this.historyData().convenant.standardCovenant[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardCovenant.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }

    // console.log('proposal-type', this.creditProposalItem[])
  }
}
