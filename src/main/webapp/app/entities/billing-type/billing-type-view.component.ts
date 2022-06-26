import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IBillingType, BillingType } from './billing-type.model';
import { BillingTypeService } from './billing-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPaymentType, PaymentType } from 'app/entities/payment-type/payment-type.model';
import { PaymentTypeService } from 'app/entities/payment-type/payment-type.service';

type SelectableEntity = IBillingType | IPaymentType;

@Component({
  selector: 'jhi-billing-type-view',
  templateUrl: './billing-type-view.component.html',
})
export class BillingTypeViewComponent extends AbstractEntityBaseViewComponent<IBillingType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  billingtypes: IBillingType[] = [];

  paymenttypes: IPaymentType[] = [];
  parentId: string;
  paymentTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingTypeService: BillingTypeService,
    protected paymentTypeService: PaymentTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(billingTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new BillingType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new BillingType();
        this.billingTypeService.find(this.id).subscribe(result => {
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

    this.paymentTypeService.loadCacheAll().subscribe((res: IPaymentType[]) => (this.paymenttypes = res || []));
  }

  prepareView() {}

  get billingType() {
    return this.item;
  }

  set billingType(billingType: IBillingType) {
    this.item = billingType;
  }

  trackBillingTypeById(index: number, item: IBillingType) {
    return item.id;
  }

  trackPaymentTypeById(index: number, item: IPaymentType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
