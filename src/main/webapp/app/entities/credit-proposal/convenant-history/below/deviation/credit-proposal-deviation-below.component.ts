import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow } from '../../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-credit-proposal-deviation-below-history',
  templateUrl: './credit-proposal-deviation-below.component.html',
  styleUrls: ['../../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalDeviationBelowHistoryComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['To be waived', 'Waived'];

  public standardCovenant: any = dataCovenantBelow;
  public copystandardCovenant: any = dataCovenantBelow;

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  public parsedData: any;

  @Input() isViewMode: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  @Input() isOnCreditAgreement: Boolean = false;
  @Input() creditAgreement: string;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.copystandardCovenant.length; i++) {
      if (i === Number(data.index)) {
        this.copystandardCovenant[i].status = input === 'status' ? event.value : this.standardCovenant[i].status;
        this.copystandardCovenant[i].deviation = input === 'deviation' ? event.target.value : this.standardCovenant[i].deviation;
        this.copystandardCovenant[i].justification =
          input === 'justification' ? event.target.value : this.standardCovenant[i].justification;
      } else {
        this.copystandardCovenant[i].status = this.statusValue[i];
        this.copystandardCovenant[i].deviation = this.deviation[i];
        this.copystandardCovenant[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardCovenant = lodash.clone(this.copystandardCovenant);
  }

  public historyData() {
    const { isOnCompareData, isCompareDar, isOnCreditAgreement, creditAgreement } = this;
    const { previousReturn, previousHistory, darRevHistory } = parsePreviousAtrribute(this.creditProposalItem);

    if (isOnCompareData) {
      if (isCompareDar) {
        return this.creditProposalItem.attributes;
      } else {
        return previousReturn;
      }
    } else {
      if (isOnCreditAgreement) {
        if (creditAgreement === 'FINAL CP') {
          return previousHistory;
        } else if (creditAgreement === 'PREVIOUS DAR') {
          return darRevHistory;
        } else if (creditAgreement === 'DAR REVISION') {
          return this.creditProposalItem.attributes;
        }
      }
      return previousHistory;
    }
  }

  ngOnInit(): void {
    this.parsedData = parsePreviousAtrribute(this.creditProposalItem);
    if (this.historyData().convenant.standardCovenant.length !== 0) {
      const deletedItem = this.historyData().convenant.standardCovenant.filter(item => item.status !== 'Applied');
      this.standardCovenant = deletedItem;
      for (let i = 0; i < this.historyData().convenant.standardCovenant.length; i++) {
        this.statusValue[i] = this.historyData().convenant.standardCovenant[i].status;
        this.deviation[i] = this.historyData().convenant.standardCovenant[i].deviation;
        this.justification[i] = this.historyData().convenant.standardCovenant[i].justification;
      }
    } else {
      this.standardCovenant = [];
    }
  }
}
