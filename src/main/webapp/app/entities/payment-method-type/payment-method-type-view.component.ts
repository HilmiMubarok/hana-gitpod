import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPaymentMethodType, PaymentMethodType } from './payment-method-type.model';
import { PaymentMethodTypeService } from './payment-method-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IGLAccount, GLAccount } from 'app/entities/gl-account/gl-account.model';
import { GLAccountService } from 'app/entities/gl-account/gl-account.service';
import { IAccountType, AccountType } from 'app/entities/account-type/account-type.model';
import { AccountTypeService } from 'app/entities/account-type/account-type.service';

type SelectableEntity = IPaymentMethodType | IGLAccount | IAccountType;

@Component({
  selector: 'jhi-payment-method-type-view',
  templateUrl: './payment-method-type-view.component.html',
})
export class PaymentMethodTypeViewComponent extends AbstractEntityBaseViewComponent<IPaymentMethodType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  paymentmethodtypes: IPaymentMethodType[] = [];

  glaccounts: IGLAccount[] = [];

  accounttypes: IAccountType[] = [];
  parentId: string;
  defGLAccountId: number;
  accountTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected paymentMethodTypeService: PaymentMethodTypeService,
    protected gLAccountService: GLAccountService,
    protected accountTypeService: AccountTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(paymentMethodTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PaymentMethodType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PaymentMethodType();
        this.paymentMethodTypeService.find(this.id).subscribe(result => {
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

    this.accountTypeService.loadCacheAll().subscribe((res: IAccountType[]) => (this.accounttypes = res || []));
  }

  prepareView() {}

  get paymentMethodType() {
    return this.item;
  }

  set paymentMethodType(paymentMethodType: IPaymentMethodType) {
    this.item = paymentMethodType;
  }

  trackPaymentMethodTypeById(index: number, item: IPaymentMethodType) {
    return item.id;
  }

  trackGLAccountById(index: number, item: IGLAccount) {
    return item.id;
  }

  trackAccountTypeById(index: number, item: IAccountType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
