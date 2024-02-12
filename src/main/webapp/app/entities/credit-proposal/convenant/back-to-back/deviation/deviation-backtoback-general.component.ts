import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackGeneral } from '../../convenant.constant';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-deviation-back-to-back-general',
  templateUrl: './deviation-backtoback-general.component.html',
  styleUrls: ['../covenant-backtoback.css'],
})
export class DeviationBackToBackGeneralComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['To be waived', 'Waived'];

  public standardDataGridBackToBackGeneral: any = dataCovenantBackToBackGeneral;
  public copyStandardDataGridBackToBackGeneral: any = dataCovenantBackToBackGeneral;

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
    for (let i = 0; i < this.copyStandardDataGridBackToBackGeneral.length; i++) {
      if (i === Number(data.index)) {
        this.copyStandardDataGridBackToBackGeneral[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackGeneral[i].status;
        this.copyStandardDataGridBackToBackGeneral[i].deviation =
          input === 'deviation' ? event.target.value : this.standardDataGridBackToBackGeneral[i].deviation;
        this.copyStandardDataGridBackToBackGeneral[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridBackToBackGeneral[i].justification;
      } else {
        this.copyStandardDataGridBackToBackGeneral[i].status = this.statusValue[i];
        this.copyStandardDataGridBackToBackGeneral[i].deviation = this.deviation[i];
        this.copyStandardDataGridBackToBackGeneral[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = lodash.clone(
      this.copyStandardDataGridBackToBackGeneral
    );
  }

  ngOnInit(): void {
    if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length !== 0) {
      const deletedItem = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.filter(
        item => item.status !== 'Applied'
      );
      this.standardDataGridBackToBackGeneral = deletedItem;
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].justification;
      }
    } else {
      this.standardDataGridBackToBackGeneral = [];
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
