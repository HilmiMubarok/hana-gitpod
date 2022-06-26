import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductTypeConfig } from './product-type-config.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-product-type-config-detail',
  templateUrl: './product-type-config-detail.component.html',
})
export class ProductTypeConfigDetailComponent implements OnInit {
  productTypeConfig: IProductTypeConfig | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productTypeConfig }) => (this.productTypeConfig = productTypeConfig));
  }

  previousState(): void {
    window.history.back();
  }
}
