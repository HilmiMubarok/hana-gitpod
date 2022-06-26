import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IBillingItemTypeMap, BillingItemTypeMap } from './billing-item-type-map.model';
import { BillingItemTypeMapService } from './billing-item-type-map.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IBillingType, BillingType } from 'app/entities/billing-type/billing-type.model';
import { BillingTypeService } from 'app/entities/billing-type/billing-type.service';
import { IBillingItemType, BillingItemType } from 'app/entities/billing-item-type/billing-item-type.model';
import { BillingItemTypeService } from 'app/entities/billing-item-type/billing-item-type.service';

type SelectableEntity = IBillingType | IBillingItemType;

@Component({
  selector: 'jhi-billing-item-type-map-view',
  templateUrl: './billing-item-type-map-view.component.html',
})
export class BillingItemTypeMapViewComponent extends AbstractEntityBaseViewComponent<IBillingItemTypeMap> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  billingtypes: IBillingType[] = [];

  billingitemtypes: IBillingItemType[] = [];
  billingTypeId: string;
  itemTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingItemTypeMapService: BillingItemTypeMapService,
    protected billingTypeService: BillingTypeService,
    protected billingItemTypeService: BillingItemTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(billingItemTypeMapService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new BillingItemTypeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new BillingItemTypeMap();
        this.billingItemTypeMapService.find(this.id).subscribe(result => {
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
    this.billingTypeService.loadCacheAll().subscribe((res: IBillingType[]) => (this.billingtypes = res || []));

    this.billingItemTypeService.loadCacheAll().subscribe((res: IBillingItemType[]) => (this.billingitemtypes = res || []));
  }

  prepareView() {}

  get billingItemTypeMap() {
    return this.item;
  }

  set billingItemTypeMap(billingItemTypeMap: IBillingItemTypeMap) {
    this.item = billingItemTypeMap;
  }

  trackBillingTypeById(index: number, item: IBillingType) {
    return item.id;
  }

  trackBillingItemTypeById(index: number, item: IBillingItemType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
