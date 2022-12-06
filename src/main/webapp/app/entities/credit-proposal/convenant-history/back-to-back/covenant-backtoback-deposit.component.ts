import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackDeposit } from '../convenant.constant';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-back-to-back-deposit-history',
  templateUrl: './covenant-backtoback-deposit.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class CovenantBackToBackDepositHistoryComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGridBackToBackDeposit: any = dataCovenantBackToBackDeposit;

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardDataGridBackToBackDeposit.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridBackToBackDeposit[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackDeposit[i].status;
        this.standardDataGridBackToBackDeposit[i].deviation =
          input === 'deviation' ? event.target.value : this.standardDataGridBackToBackDeposit[i].deviation;
        this.standardDataGridBackToBackDeposit[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridBackToBackDeposit[i].justification;
      } else {
        this.standardDataGridBackToBackDeposit[i].status = this.statusValue[i];
        this.standardDataGridBackToBackDeposit[i].deviation = this.deviation[i];
        this.standardDataGridBackToBackDeposit[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = lodash.clone(
      this.standardDataGridBackToBackDeposit
    );
  }

  ngOnInit(): void {
    if (this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit.length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit[i].deviation;
        this.justification[i] =
          this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }

    // console.log('proposal-type', this.creditProposalItem[])
  }
}
