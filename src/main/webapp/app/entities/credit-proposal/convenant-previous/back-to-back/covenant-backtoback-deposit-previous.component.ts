import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackDeposit } from '../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-back-to-back-deposit-previous',
  templateUrl: './covenant-backtoback-deposit-previous.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class CovenantBackToBackDepositPreviousComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGridBackToBackDeposit: any = dataCovenantBackToBackDeposit;

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  public dataPrevious;

  @Input() isOffering: Boolean = false;

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
    this.dataPrevious = parsePreviousAtrribute(this.creditProposalItem);
    // if previous return exist
    if (this.creditProposalItem.attributes['previousReturn'] && !this.isOffering) {
      if (this.dataPrevious.previousReturn.covenant.standardDataGridBackToBackDeposit.length !== 0) {
        for (let i = 0; i < this.dataPrevious.previousReturn.covenant.standardDataGridBackToBackDeposit.length; i++) {
          this.statusValue[i] = this.dataPrevious.previousReturn.covenant.standardDataGridBackToBackDeposit[i].status;
          this.deviation[i] = this.dataPrevious.previousReturn.covenant.standardDataGridBackToBackDeposit[i].deviation;
          this.justification[i] = this.dataPrevious.previousReturn.covenant.standardDataGridBackToBackDeposit[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardDataGridBackToBackDeposit.length; i++) {
          this.statusValue[i] = 'Applied';
        }
      }
    } else if (this.isOffering) {
      if (this.dataPrevious.previousHistory.covenant.standardDataGridBackToBackDeposit.length !== 0) {
        for (let i = 0; i < this.dataPrevious.previousHistory.covenant.standardDataGridBackToBackDeposit.length; i++) {
          this.statusValue[i] = this.dataPrevious.previousHistory.covenant.standardDataGridBackToBackDeposit[i].status;
          this.deviation[i] = this.dataPrevious.previousHistory.covenant.standardDataGridBackToBackDeposit[i].deviation;
          this.justification[i] = this.dataPrevious.previousHistory.covenant.standardDataGridBackToBackDeposit[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardDataGridBackToBackDeposit.length; i++) {
          this.statusValue[i] = 'Applied';
        }
      }
    } else {
      for (let i = 0; i <= this.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }
  }

  addBRBeforeDash(text: string): string {
    if (text === '') {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    } else {
      return text;
    }
  }
}
