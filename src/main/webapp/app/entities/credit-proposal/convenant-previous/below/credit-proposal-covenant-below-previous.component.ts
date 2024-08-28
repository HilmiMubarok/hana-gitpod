import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow } from '../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-below-previous',
  templateUrl: './credit-proposal-covenant-below-previous.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalCovenantBelowPreviousComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardCovenant: any = dataCovenantBelow;

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
    for (let i = 0; i < this.standardCovenant.length; i++) {
      if (i === Number(data.index)) {
        this.standardCovenant[i].status = input === 'status' ? event.value : this.standardCovenant[i].status;
        this.standardCovenant[i].deviation = input === 'deviation' ? event.target.value : this.standardCovenant[i].deviation;
        this.standardCovenant[i].justification = input === 'justification' ? event.target.value : this.standardCovenant[i].justification;
      } else {
        this.standardCovenant[i].status = this.statusValue[i];
        this.standardCovenant[i].deviation = this.deviation[i];
        this.standardCovenant[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardCovenant = lodash.clone(this.standardCovenant);
  }

  ngOnInit(): void {
    this.dataPrevious = parsePreviousAtrribute(this.creditProposalItem);
    // if previousReturn attribute exists
    if (this.creditProposalItem.attributes['previousReturn'] && !this.isOffering) {
      if (this.dataPrevious.previousReturn.convenant.standardCovenant.length !== 0) {
        for (let i = 0; i < this.dataPrevious.previousReturn.convenant.standardCovenant.length; i++) {
          this.statusValue[i] = this.dataPrevious.previousReturn.convenant.standardCovenant[i].status;
          this.deviation[i] = this.dataPrevious.previousReturn.convenant.standardCovenant[i].deviation;
          this.justification[i] = this.dataPrevious.previousReturn.convenant.standardCovenant[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardCovenant.length; i++) {
          this.statusValue[i] = 'Applied';
        }
      }
    } else if (this.isOffering) {
      if (this.dataPrevious.previousHistory.convenant.standardCovenant.length !== 0) {
        for (let i = 0; i < this.dataPrevious.previousHistory.convenant.standardCovenant.length; i++) {
          this.statusValue[i] = this.dataPrevious.previousHistory.convenant.standardCovenant[i].status;
          this.deviation[i] = this.dataPrevious.previousHistory.convenant.standardCovenant[i].deviation;
          this.justification[i] = this.dataPrevious.previousHistory.convenant.standardCovenant[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardCovenant.length; i++) {
          this.statusValue[i] = 'Applied';
        }
      }
    } else {
      for (let i = 0; i <= this.standardCovenant.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }

    // console.log('proposal-type', this.creditProposalItem[])
    // Filter standard covenant only status === waived and to be waived
    this.standardCovenant = this.standardCovenant.filter((item: any) => item.status === 'Waived' || item.status === 'To be waived');
  }
}
