import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerInfo } from './customer-info.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-customer-info-detail',
  templateUrl: './customer-info-detail.component.html',
})
export class CustomerInfoDetailComponent implements OnInit {
  customerInfo: ICustomerInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerInfo }) => (this.customerInfo = customerInfo));
  }

  previousState(): void {
    window.history.back();
  }
}
