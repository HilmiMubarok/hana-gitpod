import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentApplication } from './payment-application.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-payment-application-detail',
  templateUrl: './payment-application-detail.component.html',
})
export class PaymentApplicationDetailComponent implements OnInit {
  paymentApplication: IPaymentApplication | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentApplication }) => (this.paymentApplication = paymentApplication));
  }

  previousState(): void {
    window.history.back();
  }
}
