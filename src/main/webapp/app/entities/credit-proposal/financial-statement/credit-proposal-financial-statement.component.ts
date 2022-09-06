import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { ProformaLaporanKeuangan } from './financial-statement.constant';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-financial-statement',
  templateUrl: './credit-proposal-financial-statement.component.html',
  styleUrls: ['./credit-proposal-financial-statement.scss'],
})
export class CreditProposalFinancialStatementComponent implements OnChanges {
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      if (!lodash.has(this.creditProposal.attributes, 'proformaLaporanKeuangan')) {
        this.creditProposal.attributes['proformaLaporanKeuangan'] = [];
        this.creditProposal.attributes['proformaLaporanKeuangan'].push(new ProformaLaporanKeuangan());
        this.creditProposal.attributes['proformaLaporanKeuangan'].push(new ProformaLaporanKeuangan());
      } else {
        this.creditProposal.attributes['proformaLaporanKeuangan'] = JSON.parse(this.creditProposal.attributes['proformaLaporanKeuangan']);
      }
    }
  }
}
