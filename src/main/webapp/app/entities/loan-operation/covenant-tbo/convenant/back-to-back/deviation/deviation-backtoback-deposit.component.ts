import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackDeposit } from '../../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-credit-proposal-tab-deviation-back-to-back-deposit-loan',
  templateUrl: './deviation-backtoback-deposit.component.html',
})
export class DeviationBackToBackDepositComponent implements OnInit {
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const parsed = parsePreviousAtrribute(this.creditProposalItem);

    if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
      const deleted = parsed['darRevHistory']['convenant'].standardDataGridBackToBackDeposit.filter(item => item.status !== 'Applied');
      this.standardDataGridBackToBackDeposit = deleted;
      for (let i = 0; i < parsed['darRevHistory']['convenant'].standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = this.standardDataGridBackToBackDeposit[i].status;
        this.deviation[i] = this.standardDataGridBackToBackDeposit[i].deviation;
        this.justification[i] = this.standardDataGridBackToBackDeposit[i].justification;
      }
    } else {
      const deleted = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.filter(
        item => item.status !== 'Applied'
      );
      this.standardDataGridBackToBackDeposit = deleted;
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].justification;
      }
    }

    if (this.standardDataGridBackToBackDeposit.length === 0) {
      this.standardDataGridBackToBackDeposit = [];
    }
  }
}
