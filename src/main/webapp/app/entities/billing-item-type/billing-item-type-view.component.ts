import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IBillingItemType, BillingItemType } from './billing-item-type.model';
import { BillingItemTypeService } from './billing-item-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IGLAccount, GLAccount } from 'app/entities/gl-account/gl-account.model';
import { GLAccountService } from 'app/entities/gl-account/gl-account.service';

type SelectableEntity = IBillingItemType | IGLAccount;

@Component({
  selector: 'jhi-billing-item-type-view',
  templateUrl: './billing-item-type-view.component.html',
})
export class BillingItemTypeViewComponent extends AbstractEntityBaseViewComponent<IBillingItemType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  billingitemtypes: IBillingItemType[] = [];

  glaccounts: IGLAccount[] = [];
  parentId: string;
  glAccountId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingItemTypeService: BillingItemTypeService,
    protected gLAccountService: GLAccountService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(billingItemTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new BillingItemType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new BillingItemType();
        this.billingItemTypeService.find(this.id).subscribe(result => {
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
    this.billingItemTypeService.loadCacheAll().subscribe((res: IBillingItemType[]) => (this.billingitemtypes = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));
  }

  prepareView() {}

  get billingItemType() {
    return this.item;
  }

  set billingItemType(billingItemType: IBillingItemType) {
    this.item = billingItemType;
  }

  trackBillingItemTypeById(index: number, item: IBillingItemType) {
    return item.id;
  }

  trackGLAccountById(index: number, item: IGLAccount) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
