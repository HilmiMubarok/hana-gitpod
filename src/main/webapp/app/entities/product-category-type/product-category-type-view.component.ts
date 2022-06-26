import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IProductCategoryType, ProductCategoryType } from './product-category-type.model';
import { ProductCategoryTypeService } from './product-category-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-product-category-type-view',
  templateUrl: './product-category-type-view.component.html',
})
export class ProductCategoryTypeViewComponent extends AbstractEntityBaseViewComponent<IProductCategoryType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  productcategorytypes: IProductCategoryType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productCategoryTypeService: ProductCategoryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(productCategoryTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ProductCategoryType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ProductCategoryType();
        this.productCategoryTypeService.find(this.id).subscribe(result => {
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
    this.productCategoryTypeService.loadCacheAll().subscribe((res: IProductCategoryType[]) => (this.productcategorytypes = res || []));
  }

  prepareView() {}

  get productCategoryType() {
    return this.item;
  }

  set productCategoryType(productCategoryType: IProductCategoryType) {
    this.item = productCategoryType;
  }

  trackProductCategoryTypeById(index: number, item: IProductCategoryType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
