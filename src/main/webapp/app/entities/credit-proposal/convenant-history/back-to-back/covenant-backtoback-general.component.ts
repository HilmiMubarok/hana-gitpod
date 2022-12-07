import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackGeneral } from '../convenant.constant';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-back-to-back-general-history',
  templateUrl: './covenant-backtoback-general.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class CovenantBackToBackGeneralHistoryComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGridBackToBackGeneral: any = dataCovenantBackToBackGeneral;

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
    for (let i = 0; i < this.standardDataGridBackToBackGeneral.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridBackToBackGeneral[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackGeneral[i].status;
        this.standardDataGridBackToBackGeneral[i].deviation =
          input === 'deviation' ? event.target.value : this.standardDataGridBackToBackGeneral[i].deviation;
        this.standardDataGridBackToBackGeneral[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridBackToBackGeneral[i].justification;
      } else {
        this.standardDataGridBackToBackGeneral[i].status = this.statusValue[i];
        this.standardDataGridBackToBackGeneral[i].deviation = this.deviation[i];
        this.standardDataGridBackToBackGeneral[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = lodash.clone(
      this.standardDataGridBackToBackGeneral
    );
  }

  ngOnInit(): void {
    if (this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackGeneral.length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackGeneral.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackGeneral[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackGeneral[i].deviation;
        this.justification[i] =
          this.creditProposalItem.attributes['previousHistory'].convenant.standardDataGridBackToBackGeneral[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridBackToBackGeneral.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }

    // console.log('proposal-type', this.creditProposalItem[])
  }
}
