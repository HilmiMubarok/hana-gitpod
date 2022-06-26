import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBillingTerm } from './billing-term.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-billing-term-detail',
  templateUrl: './billing-term-detail.component.html',
})
export class BillingTermDetailComponent implements OnInit {
  billingTerm: IBillingTerm | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billingTerm }) => (this.billingTerm = billingTerm));
  }

  previousState(): void {
    window.history.back();
  }
}
