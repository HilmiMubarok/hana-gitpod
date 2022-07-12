import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreditProposal } from './credit-proposal.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-credit-proposal-detail',
  templateUrl: './credit-proposal-detail.component.html',
})
export class CreditProposalDetailComponent implements OnInit {
  creditProposal: ICreditProposal | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditProposal }) => (this.creditProposal = creditProposal));
  }

  previousState(): void {
    window.history.back();
  }
}
