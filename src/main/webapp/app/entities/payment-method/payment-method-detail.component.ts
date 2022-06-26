import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';

import { IPaymentMethod } from './payment-method.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-payment-method-detail',
  templateUrl: './payment-method-detail.component.html',
})
export class PaymentMethodDetailComponent implements OnInit {
  paymentMethod: IPaymentMethod | null = null;

  constructor(protected dataUtils: BaseDataUtils, protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentMethod }) => (this.paymentMethod = paymentMethod));
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }
}
