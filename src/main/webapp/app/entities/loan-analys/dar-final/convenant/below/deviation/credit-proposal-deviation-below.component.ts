import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow } from '../../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-deviation-below-temp',
  templateUrl: './credit-proposal-deviation-below.component.html',
  styleUrls: ['./credit-proposal-deviation-below.style.css'],
})
export class CreditProposalDeviationBelowTempComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['To be waived', 'Waived'];

  public standardCovenant: any = dataCovenantBelow;
  public copystandardCovenant: any = dataCovenantBelow;

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

  constructor(private router: Router) {}
  ngOnInit(): void {
    const parsed = parsePreviousAtrribute(this.creditProposalItem);

    if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
      const deleted = parsed['darRevHistory']['convenant'].standardDataGridAbove.filter(item => item.status !== 'Applied');
      this.standardCovenant = deleted;
      for (let i = 0; i < parsed['darRevHistory']['convenant'].standardCovenant.length; i++) {
        this.statusValue[i] = this.standardCovenant[i].status;
        this.deviation[i] = this.standardCovenant[i].deviation;
        this.justification[i] = this.standardCovenant[i].justification;
      }
    } else {
      const deleted = this.creditProposalItem.attributes['convenant'].standardCovenant.filter(item => item.status !== 'Applied');
      this.standardCovenant = deleted;
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].justification;
      }
    }

    if (this.standardCovenant.length === 0) {
      this.standardCovenant = [];
    }
  }

  addBRBeforeDash(text: string): string {
    const hasil = text.replace(/\n/g, '<br/>');
    return hasil;
  }
}
