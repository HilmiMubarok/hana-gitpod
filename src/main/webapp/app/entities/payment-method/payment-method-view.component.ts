import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPaymentMethod, PaymentMethod } from './payment-method.model';
import { PaymentMethodService } from './payment-method.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPaymentMethodType, PaymentMethodType } from 'app/entities/payment-method-type/payment-method-type.model';
import { PaymentMethodTypeService } from 'app/entities/payment-method-type/payment-method-type.service';
import { IGLAccount, GLAccount } from 'app/entities/gl-account/gl-account.model';
import { GLAccountService } from 'app/entities/gl-account/gl-account.service';
import { IFinAccount, FinAccount } from 'app/entities/fin-account/fin-account.model';
import { FinAccountService } from 'app/entities/fin-account/fin-account.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IPaymentMethodType | IGLAccount | IFinAccount | IParty;

@Component({
  selector: 'jhi-payment-method-view',
  templateUrl: './payment-method-view.component.html',
})
export class PaymentMethodViewComponent extends AbstractEntityBaseViewComponent<IPaymentMethod> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  paymentmethodtypes: IPaymentMethodType[] = [];

  glaccounts: IGLAccount[] = [];

  finaccounts: IFinAccount[] = [];

  parties: IParty[] = [];
  paymentMethodTypeId: string;
  glAccountId: string;
  finAccountId: number;
  internalId: string;
  providerId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected paymentMethodService: PaymentMethodService,
    protected paymentMethodTypeService: PaymentMethodTypeService,
    protected gLAccountService: GLAccountService,
    protected finAccountService: FinAccountService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(paymentMethodService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PaymentMethod();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PaymentMethod();
        this.paymentMethodService.find(this.id).subscribe(result => {
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
    this.paymentMethodTypeService.loadCacheAll().subscribe((res: IPaymentMethodType[]) => (this.paymentmethodtypes = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));

    this.finAccountService.loadCacheAll().subscribe((res: IFinAccount[]) => (this.finaccounts = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get paymentMethod() {
    return this.item;
  }

  set paymentMethod(paymentMethod: IPaymentMethod) {
    this.item = paymentMethod;
  }

  trackPaymentMethodTypeById(index: number, item: IPaymentMethodType) {
    return item.id;
  }

  trackGLAccountById(index: number, item: IGLAccount) {
    return item.id;
  }

  trackFinAccountById(index: number, item: IFinAccount) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
