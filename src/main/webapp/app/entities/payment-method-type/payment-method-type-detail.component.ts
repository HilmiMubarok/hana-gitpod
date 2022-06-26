import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentMethodType } from './payment-method-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-payment-method-type-detail',
  templateUrl: './payment-method-type-detail.component.html',
})
export class PaymentMethodTypeDetailComponent implements OnInit {
  paymentMethodType: IPaymentMethodType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentMethodType }) => (this.paymentMethodType = paymentMethodType));
  }

  previousState(): void {
    window.history.back();
  }
}
