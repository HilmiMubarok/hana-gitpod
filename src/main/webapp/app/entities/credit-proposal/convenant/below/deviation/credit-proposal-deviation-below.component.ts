import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow } from '../../convenant.constant';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-deviation-below',
  templateUrl: './credit-proposal-deviation-below.component.html',
  styleUrls: ['../../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalDeviationBelowComponent implements OnInit, OnChanges {
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

  ngOnInit(): void {
    if (this.creditProposalItem.attributes['convenant'].standardCovenant.length !== 0) {
      const deletedItem = this.creditProposalItem.attributes['convenant'].standardCovenant.filter(item => item.status !== 'Applied');
      this.standardCovenant = deletedItem;
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].justification;
      }
    } else {
      this.standardCovenant = [];
    }
  }
  addBRBeforeDash(text: string): string {
    const hasil = text.replace(/(-) /g, '<br/>$1 ');
    return hasil;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.standardCovenant = [
      ...this.standardCovenant,
      changes.creditProposalItem.currentValue.attributes['convenant'].standardDataGridAbove,
    ];
  }
}
