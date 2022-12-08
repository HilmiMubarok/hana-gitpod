import { Component, Input } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-comprae-approval-report',
  templateUrl: './compare-approval-report.component.html',
  styleUrls: ['./compare-approval-report.css'],
})
export class CompareApprovalReportComponent {
  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';

  public _creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(param: ICreditProposal) {
    this._creditProposal = param;
  }
}
