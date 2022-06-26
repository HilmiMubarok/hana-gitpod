import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBillingItem } from './billing-item.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-billing-item-detail',
  templateUrl: './billing-item-detail.component.html',
})
export class BillingItemDetailComponent implements OnInit {
  billingItem: IBillingItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billingItem }) => (this.billingItem = billingItem));
  }

  previousState(): void {
    window.history.back();
  }
}
