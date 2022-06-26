import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductConfig } from './product-config.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-product-config-detail',
  templateUrl: './product-config-detail.component.html',
})
export class ProductConfigDetailComponent implements OnInit {
  productConfig: IProductConfig | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productConfig }) => (this.productConfig = productConfig));
  }

  previousState(): void {
    window.history.back();
  }
}
