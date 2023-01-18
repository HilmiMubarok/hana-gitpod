import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantAbove } from '../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-above-previous',
  templateUrl: './credit-proposal-covenant-above-previous.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalCovenantAbovePreviousComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGridAbove: any = dataCovenantAbove;

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  public dataSource;

  @Input() isOffering: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardDataGridAbove.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridAbove[i].status = input === 'status' ? event.value : this.standardDataGridAbove[i].status;
        this.standardDataGridAbove[i].deviation = input === 'deviation' ? event.target.value : this.standardDataGridAbove[i].deviation;
        this.standardDataGridAbove[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridAbove[i].justification;
      } else {
        this.standardDataGridAbove[i].status = this.statusValue[i];
        this.standardDataGridAbove[i].deviation = this.deviation[i];
        this.standardDataGridAbove[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridAbove = lodash.clone(this.standardDataGridAbove);
  }

  ngOnInit(): void {
    this.dataSource = parsePreviousAtrribute(this.creditProposalItem);
    if (this.creditProposalItem.attributes['previousReturn'] && !this.isOffering) {
      if (this.dataSource.previousReturn.convenant.standardDataGridAbove.length !== 0) {
        for (let i = 0; i < this.dataSource.previousReturn.convenant.standardDataGridAbove.length; i++) {
          this.statusValue[i] = this.dataSource.previousReturn.convenant.standardDataGridAbove[i].status;
          this.deviation[i] = this.dataSource.previousReturn.convenant.standardDataGridAbove[i].deviation;
          this.justification[i] = this.dataSource.previousReturn.convenant.standardDataGridAbove[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardDataGridAbove.length; i++) {
          this.statusValue[i] = 'Applied';
        }
      }
    } else if (this.isOffering) {
      if (this.dataSource.previousHistory.convenant.standardDataGridAbove.length !== 0) {
        for (let i = 0; i < this.dataSource.previousHistory.convenant.standardDataGridAbove.length; i++) {
          this.statusValue[i] = this.dataSource.previousHistory.convenant.standardDataGridAbove[i].status;
          this.deviation[i] = this.dataSource.previousHistory.convenant.standardDataGridAbove[i].deviation;
          this.justification[i] = this.dataSource.previousHistory.convenant.standardDataGridAbove[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardDataGridAbove.length; i++) {
          this.statusValue[i] = 'Applied';
        }
      }
    } else {
      for (let i = 0; i <= this.standardDataGridAbove.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }

    // console.log('proposal-type', this.creditProposalItem[])
  }
}
