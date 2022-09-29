import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { ProformaLaporanKeuangan } from './financial-statement.constant';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-financial-statement',
  templateUrl: './credit-proposal-financial-statement.component.html',
  styleUrls: ['./credit-proposal-financial-statement.scss'],
})
export class CreditProposalFinancialStatementComponent {
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor() {}

  numberInputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return Number(num);
  }

  inputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return String(num);
  }
}
