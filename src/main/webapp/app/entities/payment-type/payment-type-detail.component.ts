import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentType } from './payment-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-payment-type-detail',
  templateUrl: './payment-type-detail.component.html',
})
export class PaymentTypeDetailComponent implements OnInit {
  paymentType: IPaymentType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentType }) => (this.paymentType = paymentType));
  }

  previousState(): void {
    window.history.back();
  }
}
