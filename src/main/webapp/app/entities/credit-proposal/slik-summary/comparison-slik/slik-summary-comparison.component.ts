import { Component, Input } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-slik-summary-comparison',
  templateUrl: './slik-summary.comparison.component.html',
  styleUrls: ['../slik.css'],
})
export class SlikSummaryComparisonComponent {
  public loading: boolean;

  private _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }

  constructor() {}
}
