import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IApplicationProduct, ApplicationProduct } from './application-product.model';
import { ApplicationProductService } from './application-product.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IBaseApplication, BaseApplication } from 'app/entities/base-application/base-application.model';
import { BaseApplicationService } from 'app/entities/base-application/base-application.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';

type SelectableEntity = IBaseApplication | IProduct;

@Component({
  selector: 'jhi-application-product-view',
  templateUrl: './application-product-view.component.html',
})
export class ApplicationProductViewComponent extends AbstractEntityBaseViewComponent<IApplicationProduct> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  baseapplications: IBaseApplication[] = [];

  products: IProduct[] = [];
  applicationId: number;
  productId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected applicationProductService: ApplicationProductService,
    protected baseApplicationService: BaseApplicationService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(applicationProductService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ApplicationProduct();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ApplicationProduct();
        this.applicationProductService.find(this.id).subscribe(result => {
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
    this.baseApplicationService.loadCacheAll().subscribe((res: IBaseApplication[]) => (this.baseapplications = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));
  }

  prepareView() {}

  get applicationProduct() {
    return this.item;
  }

  set applicationProduct(applicationProduct: IApplicationProduct) {
    this.item = applicationProduct;
  }

  trackBaseApplicationById(index: number, item: IBaseApplication) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
