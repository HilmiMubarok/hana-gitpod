import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { LoanAnalysService } from 'app/entities/loan-analys/loan-analys.service';

@Component({
  selector: 'jhi-disbursment-approve',
  templateUrl: './disbursment-approve.component.html',
  styleUrls: ['./disbursment-approve.css'],
})
export class DisbursmentApproveComponent {
  public _creditProposal: ICreditProposal;

  constructor() {}

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }
}
