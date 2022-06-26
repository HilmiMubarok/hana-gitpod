import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IProductCategory, ProductCategory } from './product-category.model';
import { ProductCategoryService } from './product-category.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IProductCategoryType, ProductCategoryType } from 'app/entities/product-category-type/product-category-type.model';
import { ProductCategoryTypeService } from 'app/entities/product-category-type/product-category-type.service';

type SelectableEntity = IProductCategory | IProductCategoryType;

@Component({
  selector: 'jhi-product-category-view',
  templateUrl: './product-category-view.component.html',
})
export class ProductCategoryViewComponent extends AbstractEntityBaseViewComponent<IProductCategory> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  productcategories: IProductCategory[] = [];

  productcategorytypes: IProductCategoryType[] = [];
  parentId: string;
  categoryTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productCategoryService: ProductCategoryService,
    protected productCategoryTypeService: ProductCategoryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(productCategoryService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ProductCategory();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ProductCategory();
        this.productCategoryService.find(this.id).subscribe(result => {
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

    this.productCategoryTypeService.loadCacheAll().subscribe((res: IProductCategoryType[]) => (this.productcategorytypes = res || []));
  }

  prepareView() {}

  get productCategory() {
    return this.item;
  }

  set productCategory(productCategory: IProductCategory) {
    this.item = productCategory;
  }

  trackProductCategoryById(index: number, item: IProductCategory) {
    return item.id;
  }

  trackProductCategoryTypeById(index: number, item: IProductCategoryType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
