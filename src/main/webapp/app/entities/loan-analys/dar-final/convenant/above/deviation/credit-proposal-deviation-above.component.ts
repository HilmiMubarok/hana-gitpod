import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantAbove } from '../../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-credit-proposal-deviation-dar-above',
  templateUrl: './credit-proposal-deviation-above.component.html',
})
export class CreditProposalDeviationDarAboveComponent implements OnInit {
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

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private router: Router) {}

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
    const parsed = parsePreviousAtrribute(this.creditProposalItem);

    if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
      const deleted = parsed['darRevHistory']['convenant'].standardDataGridAbove.filter(item => item.status !== 'Applied');
      this.standardDataGridAbove = deleted;
      for (let i = 0; i < parsed['darRevHistory']['convenant'].standardDataGridAbove.length; i++) {
        this.statusValue[i] = this.standardDataGridAbove[i].status;
        this.deviation[i] = this.standardDataGridAbove[i].deviation;
        this.justification[i] = this.standardDataGridAbove[i].justification;
      }
    } else {
      const deleted = this.creditProposalItem.attributes['convenant'].standardDataGridAbove.filter(item => item.status !== 'Applied');
      this.standardDataGridAbove = deleted;
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].justification;
      }
    }

    if (this.standardDataGridAbove.length === 0) {
      this.standardDataGridAbove = [];
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
