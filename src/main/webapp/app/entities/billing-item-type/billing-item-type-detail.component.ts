import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBillingItemType } from './billing-item-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-billing-item-type-detail',
  templateUrl: './billing-item-type-detail.component.html',
})
export class BillingItemTypeDetailComponent implements OnInit {
  billingItemType: IBillingItemType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billingItemType }) => (this.billingItemType = billingItemType));
  }

  previousState(): void {
    window.history.back();
  }
}
