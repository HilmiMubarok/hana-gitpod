import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBillingItemTypeMap } from './billing-item-type-map.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-billing-item-type-map-detail',
  templateUrl: './billing-item-type-map-detail.component.html',
})
export class BillingItemTypeMapDetailComponent implements OnInit {
  billingItemTypeMap: IBillingItemTypeMap | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billingItemTypeMap }) => (this.billingItemTypeMap = billingItemTypeMap));
  }

  previousState(): void {
    window.history.back();
  }
}
