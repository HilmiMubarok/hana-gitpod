import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVendorProduct } from './vendor-product.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-vendor-product-detail',
  templateUrl: './vendor-product-detail.component.html',
})
export class VendorProductDetailComponent implements OnInit {
  vendorProduct: IVendorProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vendorProduct }) => (this.vendorProduct = vendorProduct));
  }

  previousState(): void {
    window.history.back();
  }
}
