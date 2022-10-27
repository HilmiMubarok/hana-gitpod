import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IApplicationProduct } from '../../application-product/application-product.model';
import { ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-previous',
  templateUrl: './credit-proposal-tab-loan-facility-detail-previous.component.html',
  styleUrls: ['./grid/loan.scss'],
})
export class CreditProposalTabLoanFacilityDetailPreviousComponent {
  public _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }
}
