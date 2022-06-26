import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBillingType } from './billing-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-billing-type-detail',
  templateUrl: './billing-type-detail.component.html',
})
export class BillingTypeDetailComponent implements OnInit {
  billingType: IBillingType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billingType }) => (this.billingType = billingType));
  }

  previousState(): void {
    window.history.back();
  }
}
