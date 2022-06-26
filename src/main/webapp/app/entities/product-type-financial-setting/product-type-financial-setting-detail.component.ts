import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductTypeFinancialSetting } from './product-type-financial-setting.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-product-type-financial-setting-detail',
  templateUrl: './product-type-financial-setting-detail.component.html',
})
export class ProductTypeFinancialSettingDetailComponent implements OnInit {
  productTypeFinancialSetting: IProductTypeFinancialSetting | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      ({ productTypeFinancialSetting }) => (this.productTypeFinancialSetting = productTypeFinancialSetting)
    );
  }

  previousState(): void {
    window.history.back();
  }
}
