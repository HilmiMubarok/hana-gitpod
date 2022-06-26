import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IProductClassification, ProductClassification } from './product-classification.model';
import { ProductClassificationService } from './product-classification.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IProductCategory, ProductCategory } from 'app/entities/product-category/product-category.model';
import { ProductCategoryService } from 'app/entities/product-category/product-category.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';

type SelectableEntity = IProductCategory | IProduct;

@Component({
  selector: 'jhi-product-classification-view',
  templateUrl: './product-classification-view.component.html',
})
export class ProductClassificationViewComponent extends AbstractEntityBaseViewComponent<IProductClassification> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  productcategories: IProductCategory[] = [];

  products: IProduct[] = [];
  categoryId: string;
  productId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productClassificationService: ProductClassificationService,
    protected productCategoryService: ProductCategoryService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(productClassificationService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ProductClassification();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ProductClassification();
        this.productClassificationService.find(this.id).subscribe(result => {
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
    this.productCategoryService.loadCacheAll().subscribe((res: IProductCategory[]) => (this.productcategories = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));
  }

  prepareView() {}

  get productClassification() {
    return this.item;
  }

  set productClassification(productClassification: IProductClassification) {
    this.item = productClassification;
  }

  trackProductCategoryById(index: number, item: IProductCategory) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
