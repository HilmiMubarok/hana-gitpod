import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IGood, Good } from './good.model';
import { GoodService } from './good.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { IProductConfig, ProductConfig } from 'app/entities/product-config/product-config.model';
import { ProductConfigService } from 'app/entities/product-config/product-config.service';

type SelectableEntity = IProductType | IProductConfig;

@Component({
  selector: 'jhi-good-view',
  templateUrl: './good-view.component.html',
})
export class GoodViewComponent extends AbstractEntityBaseViewComponent<IGood> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  producttypes: IProductType[] = [];

  productconfigs: IProductConfig[] = [];
  productTypeId: string;
  configId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected goodService: GoodService,
    protected productTypeService: ProductTypeService,
    protected productConfigService: ProductConfigService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(goodService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Good();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Good();
        this.goodService.find(this.id).subscribe(result => {
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

    this.productConfigService.loadCacheAll().subscribe((res: IProductConfig[]) => (this.productconfigs = res || []));
  }

  prepareView() {}

  get good() {
    return this.item;
  }

  set good(good: IGood) {
    this.item = good;
  }

  trackProductTypeById(index: number, item: IProductType) {
    return item.id;
  }

  trackProductConfigById(index: number, item: IProductConfig) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
