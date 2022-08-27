import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IApplicationProduct } from './application-product.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-application-product-detail',
  templateUrl: './application-product-detail.component.html',
})
export class ApplicationProductDetailComponent implements OnInit {
  applicationProduct: IApplicationProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationProduct }) => (this.applicationProduct = applicationProduct));
  }

  previousState(): void {
    window.history.back();
  }
}
