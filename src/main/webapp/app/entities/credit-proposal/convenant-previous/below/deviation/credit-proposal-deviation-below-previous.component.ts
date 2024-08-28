import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow } from '../../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-credit-proposal-deviation-below-previous',
  templateUrl: './credit-proposal-deviation-below-previous.component.html',
})
export class CreditProposalDeviationBelowPreviousComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['To be waived', 'Waived'];
  public dataSource: any;
  public standardCovenant: any = dataCovenantBelow;
  public copystandardCovenant: any = dataCovenantBelow;

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

  ngOnInit(): void {
    this.dataPrevious = parsePreviousAtrribute(this.creditProposalItem);
    // if previousReturn is exist
    if (this.creditProposalItem.attributes['previousReturn'] && !this.isOffering) {
      if (this.dataPrevious.previousReturn.convenant.standardCovenant.length !== 0) {
        const deletedItem = this.dataPrevious.previousReturn.convenant.standardCovenant.filter(item => item.status !== 'Applied');
        this.dataPrevious.previousReturn.convenant.standardCovenant = deletedItem;
        for (let i = 0; i < this.dataPrevious.previousReturn.convenant.standardCovenant.length; i++) {
          this.statusValue[i] = this.dataPrevious.previousReturn.convenant.standardCovenant[i].status;
          this.deviation[i] = this.dataPrevious.previousReturn.convenant.standardCovenant[i].deviation;
          this.justification[i] = this.dataPrevious.previousReturn.convenant.standardCovenant[i].justification;
        }
      } else {
        this.standardCovenant = [];
      }
    } else if (this.isOffering) {
      if (this.dataPrevious.previousHistory.convenant.standardCovenant.length !== 0) {
        const deletedItem = this.dataPrevious.previousHistory.convenant.standardCovenant.filter(item => item.status !== 'Applied');
        this.dataPrevious.previousHistory.convenant.standardCovenant = deletedItem;
        for (let i = 0; i < this.dataPrevious.previousHistory.convenant.standardCovenant.length; i++) {
          this.statusValue[i] = this.dataPrevious.previousHistory.convenant.standardCovenant[i].status;
          this.deviation[i] = this.dataPrevious.previousHistory.convenant.standardCovenant[i].deviation;
          this.justification[i] = this.dataPrevious.previousHistory.convenant.standardCovenant[i].justification;
        }
      } else {
        this.standardCovenant = [];
      }
    } else {
      this.dataSource = [];
    }
  }
}
