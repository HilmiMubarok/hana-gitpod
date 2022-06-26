import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductClassification } from './product-classification.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-product-classification-detail',
  templateUrl: './product-classification-detail.component.html',
})
export class ProductClassificationDetailComponent implements OnInit {
  productClassification: IProductClassification | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productClassification }) => (this.productClassification = productClassification));
  }

  previousState(): void {
    window.history.back();
  }
}
