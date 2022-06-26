import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IServiceProduct } from './service-product.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-service-product-detail',
  templateUrl: './service-product-detail.component.html',
})
export class ServiceProductDetailComponent implements OnInit {
  serviceProduct: IServiceProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ serviceProduct }) => (this.serviceProduct = serviceProduct));
  }

  previousState(): void {
    window.history.back();
  }
}
