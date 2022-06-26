import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoanApplication } from './loan-application.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-loan-application-detail',
  templateUrl: './loan-application-detail.component.html',
})
export class LoanApplicationDetailComponent implements OnInit {
  loanApplication: ILoanApplication | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanApplication }) => (this.loanApplication = loanApplication));
  }

  previousState(): void {
    window.history.back();
  }
}
