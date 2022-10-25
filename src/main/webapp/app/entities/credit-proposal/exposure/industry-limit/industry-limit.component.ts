import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { IndustryLimit, IIndustryLimit } from './industry-limit.model';

@Component({
  selector: 'jhi-industry-limit',
  templateUrl: './industry-limit.component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class IndustryLimitComponent {
  public _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }
}
