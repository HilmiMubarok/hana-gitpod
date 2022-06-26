import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPaymentApplication, PaymentApplication } from './payment-application.model';
import { PaymentApplicationService } from './payment-application.service';
import { IPayment, Payment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/payment.service';
import { IBilling, Billing } from 'app/entities/billing/billing.model';
import { BillingService } from 'app/entities/billing/billing.service';
import { IBillingItem, BillingItem } from 'app/entities/billing-item/billing-item.model';
import { BillingItemService } from 'app/entities/billing-item/billing-item.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPayment | IBilling | IBillingItem;

@Component({
  selector: 'jhi-payment-application-update',
  templateUrl: './payment-application-update.component.html',
})
export class PaymentApplicationUpdateComponent extends AbstractEntityUpdateComponent<IPaymentApplication> {
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
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, paymentApplicationService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'paymentApplicationListModification';
  }

  protected initialState(): any {
    return { item: new PaymentApplication(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['paymentId']) {
        this.paymentId = params['paymentId'];
      }
      if (params['billingId']) {
        this.billingId = params['billingId'];
      }
      if (params['billingItemId']) {
        this.billingItemId = params['billingItemId'];
      }
    });

    this.paymentService.loadCacheAll().subscribe((res: IPayment[]) => (this.payments = res || []));

    this.billingService.loadCacheAll().subscribe((res: IBilling[]) => (this.billings = res || []));

    this.billingItemService.loadCacheAll().subscribe((res: IBillingItem[]) => (this.billingitems = res || []));
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state);
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
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
    return this.stateSubject.getValue().item.id;
  }

  get paymentApplication() {
    return this.item;
  }
}
