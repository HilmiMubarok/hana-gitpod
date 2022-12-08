import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackDeposit } from '../../convenant.constant';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-deviation-back-to-back-deposit-previous',
  templateUrl: './deviation-backtoback-deposit-previous.component.html',
})
export class DeviationBackToBackDepositPreviousComponent implements OnInit {
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

  @Input() isOffering: Boolean = false;

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

  ngOnInit(): void {
    // if previousReturn exist
    if (this.creditProposalItem.attributes['previousReturn'] && !this.isOffering) {
      if (this.creditProposalItem.attributes['previousReturn'].convenant.standardDataGridBackToBackDeposit.length !== 0) {
        const deletedItem = this.creditProposalItem.attributes['previousReturn'].convenant.standardDataGridBackToBackDeposit.filter(
          item => item.status !== 'Applied'
        );
        this.standardDataGridBackToBackDeposit = deletedItem;
        for (let i = 0; i < this.creditProposalItem.attributes['previousReturn'].convenant.standardDataGridBackToBackDeposit.length; i++) {
          this.statusValue[i] = this.creditProposalItem.attributes['previousReturn'].convenant.standardDataGridBackToBackDeposit[i].status;
          this.deviation[i] = this.creditProposalItem.attributes['previousReturn'].convenant.standardDataGridBackToBackDeposit[i].deviation;
          this.justification[i] =
            this.creditProposalItem.attributes['previousReturn'].convenant.standardDataGridBackToBackDeposit[i].justification;
        }
      } else {
        this.standardDataGridBackToBackDeposit = [];
      }
    } else if (this.isOffering) {
      if (this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit.length !== 0) {
        const deletedItem = this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit.filter(
          item => item.status !== 'Applied'
        );
        this.standardDataGridBackToBackDeposit = deletedItem;
        for (let i = 0; i < this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit.length; i++) {
          this.statusValue[i] = this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit[i].status;
          this.deviation[i] =
            this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit[i].deviation;
          this.justification[i] =
            this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackDeposit[i].justification;
        }
      } else {
        this.standardDataGridBackToBackDeposit = [];
      }
    } else {
      this.standardDataGridBackToBackDeposit = [];
    }
  }
}
