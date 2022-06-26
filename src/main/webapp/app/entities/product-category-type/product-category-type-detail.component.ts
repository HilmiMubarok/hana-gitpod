import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductCategoryType } from './product-category-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-product-category-type-detail',
  templateUrl: './product-category-type-detail.component.html',
})
export class ProductCategoryTypeDetailComponent implements OnInit {
  productCategoryType: IProductCategoryType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productCategoryType }) => (this.productCategoryType = productCategoryType));
  }

  previousState(): void {
    window.history.back();
  }
}
