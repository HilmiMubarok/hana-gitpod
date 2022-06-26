import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentGLAccountTypeMap } from './payment-gl-account-type-map.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-payment-gl-account-type-map-detail',
  templateUrl: './payment-gl-account-type-map-detail.component.html',
})
export class PaymentGLAccountTypeMapDetailComponent implements OnInit {
  paymentGLAccountTypeMap: IPaymentGLAccountTypeMap | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentGLAccountTypeMap }) => (this.paymentGLAccountTypeMap = paymentGLAccountTypeMap));
  }

  previousState(): void {
    window.history.back();
  }
}
