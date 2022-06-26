import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IBillingItem, BillingItem } from './billing-item.model';
import { BillingItemService } from './billing-item.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IBilling, Billing } from 'app/entities/billing/billing.model';
import { BillingService } from 'app/entities/billing/billing.service';
import { IBillingItemType, BillingItemType } from 'app/entities/billing-item-type/billing-item-type.model';
import { BillingItemTypeService } from 'app/entities/billing-item-type/billing-item-type.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IFeature, Feature } from 'app/entities/feature/feature.model';
import { FeatureService } from 'app/entities/feature/feature.service';

type SelectableEntity = IBilling | IBillingItemType | IProduct | IFeature;

@Component({
  selector: 'jhi-billing-item-view',
  templateUrl: './billing-item-view.component.html',
})
export class BillingItemViewComponent extends AbstractEntityBaseViewComponent<IBillingItem> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  billings: IBilling[] = [];

  billingitemtypes: IBillingItemType[] = [];

  products: IProduct[] = [];

  features: IFeature[] = [];
  billingId: number;
  itemTypeId: string;
  productId: string;
  featureId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingItemService: BillingItemService,
    protected billingService: BillingService,
    protected billingItemTypeService: BillingItemTypeService,
    protected productService: ProductService,
    protected featureService: FeatureService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(billingItemService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new BillingItem();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new BillingItem();
        this.billingItemService.find(this.id).subscribe(result => {
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
    this.billingService.loadCacheAll().subscribe((res: IBilling[]) => (this.billings = res || []));

    this.billingItemTypeService.loadCacheAll().subscribe((res: IBillingItemType[]) => (this.billingitemtypes = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));

    this.featureService.loadCacheAll().subscribe((res: IFeature[]) => (this.features = res || []));
  }

  prepareView() {}

  get billingItem() {
    return this.item;
  }

  set billingItem(billingItem: IBillingItem) {
    this.item = billingItem;
  }

  trackBillingById(index: number, item: IBilling) {
    return item.id;
  }

  trackBillingItemTypeById(index: number, item: IBillingItemType) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  trackFeatureById(index: number, item: IFeature) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
