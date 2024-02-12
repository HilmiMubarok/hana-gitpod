import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackDeposit } from '../../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-credit-proposal-tab-deviation-back-to-back-deposit-history',
  templateUrl: './deviation-backtoback-deposit.component.html',
  styleUrls: ['../covenant-backtoback.css'],
})
export class DeviationBackToBackDepositHistoryComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['To be waived', 'Waived'];

  public standardDataGridBackToBackDeposit: any = dataCovenantBackToBackDeposit;
  public copyStandardDataGridBackToBackDeposit: any = dataCovenantBackToBackDeposit;

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
    for (let i = 0; i < this.copyStandardDataGridBackToBackDeposit.length; i++) {
      if (i === Number(data.index)) {
        this.copyStandardDataGridBackToBackDeposit[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackDeposit[i].status;
        this.copyStandardDataGridBackToBackDeposit[i].deviation =
          input === 'deviation' ? event.target.value : this.standardDataGridBackToBackDeposit[i].deviation;
        this.copyStandardDataGridBackToBackDeposit[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridBackToBackDeposit[i].justification;
      } else {
        this.copyStandardDataGridBackToBackDeposit[i].status = this.statusValue[i];
        this.copyStandardDataGridBackToBackDeposit[i].deviation = this.deviation[i];
        this.copyStandardDataGridBackToBackDeposit[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = lodash.clone(
      this.copyStandardDataGridBackToBackDeposit
    );
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
    if (this.historyData().convenant.standardDataGridBackToBackDeposit.length !== 0) {
      const deletedItem = this.historyData().convenant.standardDataGridBackToBackDeposit.filter(item => item.status !== 'Applied');
      this.standardDataGridBackToBackDeposit = deletedItem;
      for (let i = 0; i < this.historyData().convenant.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].status;
        this.deviation[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].deviation;
        this.justification[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].justification;
      }
    } else {
      this.standardDataGridBackToBackDeposit = [];
    }
  }

  addBRBeforeDash(text: string): string {
    if (text === '' || text === undefined || text === null) {
      return text;
    } else {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    }
  }
}
