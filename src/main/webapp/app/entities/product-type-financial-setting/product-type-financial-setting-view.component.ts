import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IProductTypeFinancialSetting, ProductTypeFinancialSetting } from './product-type-financial-setting.model';
import { ProductTypeFinancialSettingService } from './product-type-financial-setting.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';

@Component({
  selector: 'jhi-product-type-financial-setting-view',
  templateUrl: './product-type-financial-setting-view.component.html',
})
export class ProductTypeFinancialSettingViewComponent
  extends AbstractEntityBaseViewComponent<IProductTypeFinancialSetting>
  implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  producttypes: IProductType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productTypeFinancialSettingService: ProductTypeFinancialSettingService,
    protected productTypeService: ProductTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(productTypeFinancialSettingService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ProductTypeFinancialSetting();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ProductTypeFinancialSetting();
        this.productTypeFinancialSettingService.find(this.id).subscribe(result => {
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

  get productTypeFinancialSetting() {
    return this.item;
  }

  set productTypeFinancialSetting(productTypeFinancialSetting: IProductTypeFinancialSetting) {
    this.item = productTypeFinancialSetting;
  }

  trackProductTypeById(index: number, item: IProductType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
