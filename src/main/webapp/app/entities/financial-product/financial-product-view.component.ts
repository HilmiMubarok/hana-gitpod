import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFinancialProduct, FinancialProduct } from './financial-product.model';
import { FinancialProductService } from './financial-product.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';

@Component({
  selector: 'jhi-financial-product-view',
  templateUrl: './financial-product-view.component.html',
})
export class FinancialProductViewComponent extends AbstractEntityBaseViewComponent<IFinancialProduct> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  producttypes: IProductType[] = [];
  productTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected financialProductService: FinancialProductService,
    protected productTypeService: ProductTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(financialProductService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new FinancialProduct();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new FinancialProduct();
        this.financialProductService.find(this.id).subscribe(result => {
          this.item = result.body;
          this.prepareView();
        });
      }
    }

    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }
      if (this.item) {
        this.prepareView();
      }
    }

    if (changes['isSaving'] && this.item.id) {
      if (this.isSaving) {
        this.save();
      }
    }
  }

  initialize() {
    this.productTypeService.loadCacheAll().subscribe((res: IProductType[]) => (this.producttypes = res || []));
  }

  prepareView() {}

  get financialProduct() {
    return this.item;
  }

  set financialProduct(financialProduct: IFinancialProduct) {
    this.item = financialProduct;
  }

  trackProductTypeById(index: number, item: IProductType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
