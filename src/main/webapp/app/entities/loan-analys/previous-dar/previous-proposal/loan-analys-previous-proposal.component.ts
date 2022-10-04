import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';

@Component({
  selector: 'jhi-loan-analys-previous-proposal',
  templateUrl: './loan-analys-previous-proposal.component.html',
  styleUrls: ['../loan-analys-previous-dar.css'],
})
export class LoanAnalysPreviousProposalComponent {
  private id: number;
  // private creditProposal: ICreditProposal;
  public creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;

  constructor(private creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute, private router: Router) {
    this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
