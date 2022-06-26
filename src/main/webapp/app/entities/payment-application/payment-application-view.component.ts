import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPaymentApplication, PaymentApplication } from './payment-application.model';
import { PaymentApplicationService } from './payment-application.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPayment, Payment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/payment.service';
import { IBilling, Billing } from 'app/entities/billing/billing.model';
import { BillingService } from 'app/entities/billing/billing.service';
import { IBillingItem, BillingItem } from 'app/entities/billing-item/billing-item.model';
import { BillingItemService } from 'app/entities/billing-item/billing-item.service';

type SelectableEntity = IPayment | IBilling | IBillingItem;

@Component({
  selector: 'jhi-payment-application-view',
  templateUrl: './payment-application-view.component.html',
})
export class PaymentApplicationViewComponent extends AbstractEntityBaseViewComponent<IPaymentApplication> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  payments: IPayment[] = [];

  billings: IBilling[] = [];

  billingitems: IBillingItem[] = [];
  paymentId: number;
  billingId: number;
  billingItemId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected paymentApplicationService: PaymentApplicationService,
    protected paymentService: PaymentService,
    protected billingService: BillingService,
    protected billingItemService: BillingItemService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(paymentApplicationService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PaymentApplication();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PaymentApplication();
        this.paymentApplicationService.find(this.id).subscribe(result => {
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
    this.paymentService.loadCacheAll().subscribe((res: IPayment[]) => (this.payments = res || []));

    this.billingService.loadCacheAll().subscribe((res: IBilling[]) => (this.billings = res || []));

    this.billingItemService.loadCacheAll().subscribe((res: IBillingItem[]) => (this.billingitems = res || []));
  }

  prepareView() {}

  get paymentApplication() {
    return this.item;
  }

  set paymentApplication(paymentApplication: IPaymentApplication) {
    this.item = paymentApplication;
  }

  trackPaymentById(index: number, item: IPayment) {
    return item.id;
  }

  trackBillingById(index: number, item: IBilling) {
    return item.id;
  }

  trackBillingItemById(index: number, item: IBillingItem) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
