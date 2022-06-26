import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFeatureApplicable, FeatureApplicable } from './feature-applicable.model';
import { FeatureApplicableService } from './feature-applicable.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IFeature, Feature } from 'app/entities/feature/feature.model';
import { FeatureService } from 'app/entities/feature/feature.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';

type SelectableEntity = IFeature | IProduct;

@Component({
  selector: 'jhi-feature-applicable-view',
  templateUrl: './feature-applicable-view.component.html',
})
export class FeatureApplicableViewComponent extends AbstractEntityBaseViewComponent<IFeatureApplicable> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  features: IFeature[] = [];

  products: IProduct[] = [];
  featureId: string;
  productId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected featureApplicableService: FeatureApplicableService,
    protected featureService: FeatureService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(featureApplicableService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new FeatureApplicable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new FeatureApplicable();
        this.featureApplicableService.find(this.id).subscribe(result => {
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
    this.featureService.loadCacheAll().subscribe((res: IFeature[]) => (this.features = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));
  }

  prepareView() {}

  get featureApplicable() {
    return this.item;
  }

  set featureApplicable(featureApplicable: IFeatureApplicable) {
    this.item = featureApplicable;
  }

  trackFeatureById(index: number, item: IFeature) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
