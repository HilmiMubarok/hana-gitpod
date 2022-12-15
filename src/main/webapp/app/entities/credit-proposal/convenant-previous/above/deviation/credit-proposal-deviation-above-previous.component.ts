import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantAbove } from '../../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-credit-proposal-deviation-above-previous',
  templateUrl: './credit-proposal-deviation-above-previous.component.html',
})
export class CreditProposalDeviationAbovePreviousComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['To be waived', 'Waived'];

  public standardDataGridAbove: any = dataCovenantAbove;
  public copystandardDataGridAbove: any = dataCovenantAbove;

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];
  public dataSource: any;
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
    for (let i = 0; i < this.copystandardDataGridAbove.length; i++) {
      if (i === Number(data.index)) {
        this.copystandardDataGridAbove[i].status = input === 'status' ? event.value : this.standardDataGridAbove[i].status;
        this.copystandardDataGridAbove[i].deviation = input === 'deviation' ? event.target.value : this.standardDataGridAbove[i].deviation;
        this.copystandardDataGridAbove[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridAbove[i].justification;
      } else {
        this.copystandardDataGridAbove[i].status = this.statusValue[i];
        this.copystandardDataGridAbove[i].deviation = this.deviation[i];
        this.copystandardDataGridAbove[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridAbove = lodash.clone(this.copystandardDataGridAbove);
  }

  ngOnInit(): void {
    this.dataPrevious = parsePreviousAtrribute(this.creditProposalItem);
    // if previousReturn attribute exists
    if (this.creditProposalItem.attributes['previousReturn'] && !this.isOffering) {
      if (this.dataPrevious.previousReturn.convenant.standardDataGridAbove.length !== 0) {
        const deletedItem = this.dataPrevious.previousReturn.convenant.standardDataGridAbove.filter(item => item.status !== 'Applied');
        this.dataPrevious.previousReturn.convenant.standardDataGridAbove = deletedItem;
        for (let i = 0; i < this.dataPrevious.previousReturn.convenant.standardDataGridAbove.length; i++) {
          this.statusValue[i] = this.dataPrevious.previousReturn.convenant.standardDataGridAbove[i].status;
          this.deviation[i] = this.dataPrevious.previousReturn.convenant.standardDataGridAbove[i].deviation;
          this.justification[i] = this.dataPrevious.previousReturn.convenant.standardDataGridAbove[i].justification;
        }
      } else {
        this.standardDataGridAbove = [];
      }
    } else if (this.isOffering) {
      if (this.dataPrevious.previousHistory.convenant.standardDataGridAbove.length !== 0) {
        const deletedItem = this.dataPrevious.previousHistory.convenant.standardDataGridAbove.filter(item => item.status !== 'Applied');
        this.dataPrevious.previousHistory.convenant.standardDataGridAbove = deletedItem;
        for (let i = 0; i < this.dataPrevious.previousHistory.convenant.standardDataGridAbove.length; i++) {
          this.statusValue[i] = this.dataPrevious.previousHistory.convenant.standardDataGridAbove[i].status;
          this.deviation[i] = this.dataPrevious.previousHistory.convenant.standardDataGridAbove[i].deviation;
          this.justification[i] = this.dataPrevious.previousHistory.convenant.standardDataGridAbove[i].justification;
        }
      } else {
        this.standardDataGridAbove = [];
      }
    } else {
      this.dataSource = [];
    }
  }
}
