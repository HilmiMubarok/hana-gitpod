import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreditApplication } from './credit-application.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-credit-application-detail',
  templateUrl: './credit-application-detail.component.html',
})
export class CreditApplicationDetailComponent implements OnInit {
  creditApplication: ICreditApplication | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditApplication }) => (this.creditApplication = creditApplication));
  }

  previousState(): void {
    window.history.back();
  }
}
