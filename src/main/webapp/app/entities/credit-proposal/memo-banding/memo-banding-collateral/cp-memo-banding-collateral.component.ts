import { Component, Input, OnChanges } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-cp-memo-banding-collateral',
  templateUrl: './cp-memo-banding-collateral.component.html',
  styleUrls: ['../../collateral-info/collateral-info-cp.style.scss'],
})
export class CpMemoBandingCollateralComponent implements OnChanges {
  @Input() creditProposal: ICreditProposal;
  proposalType: string;

  ngOnChanges() {
    this.proposalType = this.creditProposal.attributes['proposalType'];
  }
}
