import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IProductConfig, ProductConfig } from './product-config.model';
import { ProductConfigService } from './product-config.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IUom, Uom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { ITaxType, TaxType } from 'app/entities/tax-type/tax-type.model';
import { TaxTypeService } from 'app/entities/tax-type/tax-type.service';

type SelectableEntity = IUom | ITaxType;

@Component({
  selector: 'jhi-product-config-view',
  templateUrl: './product-config-view.component.html',
})
export class ProductConfigViewComponent extends AbstractEntityBaseViewComponent<IProductConfig> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  uoms: IUom[] = [];

  taxtypes: ITaxType[] = [];
  uomId: string;
  purchaseTaxId: string;
  salesTaxId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productConfigService: ProductConfigService,
    protected uomService: UomService,
    protected taxTypeService: TaxTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(productConfigService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ProductConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ProductConfig();
        this.productConfigService.find(this.id).subscribe(result => {
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
    this.uomService.loadCacheAll().subscribe((res: IUom[]) => (this.uoms = res || []));

    this.taxTypeService.loadCacheAll().subscribe((res: ITaxType[]) => (this.taxtypes = res || []));
  }

  prepareView() {}

  get productConfig() {
    return this.item;
  }

  set productConfig(productConfig: IProductConfig) {
    this.item = productConfig;
  }

  trackUomById(index: number, item: IUom) {
    return item.id;
  }

  trackTaxTypeById(index: number, item: ITaxType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
