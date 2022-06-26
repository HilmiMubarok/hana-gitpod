import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinancialProduct } from './financial-product.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-financial-product-detail',
  templateUrl: './financial-product-detail.component.html',
})
export class FinancialProductDetailComponent implements OnInit {
  financialProduct: IFinancialProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ financialProduct }) => (this.financialProduct = financialProduct));
  }

  previousState(): void {
    window.history.back();
  }
}
