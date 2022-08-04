import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { ICreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-sliksummary-detail',
  templateUrl: './credit-proposal-slik-summary-detail.component.html',
  styleUrls: ['./css/slik-sumarry.css'],
})
export class CreditProposalSlikSummaryDetailComponent implements OnInit {
  creditProposal: ICreditProposal | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditProposal }) => (this.creditProposal = creditProposal));
  }

  previousState(): void {
    window.history.back();
  }
}
