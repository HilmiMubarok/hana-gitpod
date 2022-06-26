import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPayment, Payment } from './payment.model';
import { PaymentService } from './payment.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPaymentType, PaymentType } from 'app/entities/payment-type/payment-type.model';
import { PaymentTypeService } from 'app/entities/payment-type/payment-type.service';
import { IPaymentMethod, PaymentMethod } from 'app/entities/payment-method/payment-method.model';
import { PaymentMethodService } from 'app/entities/payment-method/payment-method.service';
import { IFinAccountTrans, FinAccountTrans } from 'app/entities/fin-account-trans/fin-account-trans.model';
import { FinAccountTransService } from 'app/entities/fin-account-trans/fin-account-trans.service';
import { IAcctgTrans, AcctgTrans } from 'app/entities/acctg-trans/acctg-trans.model';
import { AcctgTransService } from 'app/entities/acctg-trans/acctg-trans.service';

type SelectableEntity = IPaymentType | IPaymentMethod | IFinAccountTrans | IAcctgTrans;

@Component({
  selector: 'jhi-payment-view',
  templateUrl: './payment-view.component.html',
})
export class PaymentViewComponent extends AbstractEntityBaseViewComponent<IPayment> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  paymenttypes: IPaymentType[] = [];

  paymentmethods: IPaymentMethod[] = [];

  finaccounttrans: IFinAccountTrans[] = [];

  acctgtrans: IAcctgTrans[] = [];
  paymentTypeId: string;
  paymentMethodId: number;
  accountTransId: number;
  acctgTransId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected paymentService: PaymentService,
    protected paymentTypeService: PaymentTypeService,
    protected paymentMethodService: PaymentMethodService,
    protected finAccountTransService: FinAccountTransService,
    protected acctgTransService: AcctgTransService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(paymentService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Payment();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Payment();
        this.paymentService.find(this.id).subscribe(result => {
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
    this.paymentTypeService.loadCacheAll().subscribe((res: IPaymentType[]) => (this.paymenttypes = res || []));

    this.paymentMethodService.loadCacheAll().subscribe((res: IPaymentMethod[]) => (this.paymentmethods = res || []));

    this.finAccountTransService.loadCacheAll().subscribe((res: IFinAccountTrans[]) => (this.finaccounttrans = res || []));

    this.acctgTransService.loadCacheAll().subscribe((res: IAcctgTrans[]) => (this.acctgtrans = res || []));
  }

  prepareView() {}

  get payment() {
    return this.item;
  }

  set payment(payment: IPayment) {
    this.item = payment;
  }

  trackPaymentTypeById(index: number, item: IPaymentType) {
    return item.id;
  }

  trackPaymentMethodById(index: number, item: IPaymentMethod) {
    return item.id;
  }

  trackFinAccountTransById(index: number, item: IFinAccountTrans) {
    return item.id;
  }

  trackAcctgTransById(index: number, item: IAcctgTrans) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
