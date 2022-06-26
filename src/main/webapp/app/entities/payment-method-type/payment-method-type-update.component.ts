import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPaymentMethodType, PaymentMethodType } from './payment-method-type.model';
import { PaymentMethodTypeService } from './payment-method-type.service';
import { IGLAccount, GLAccount } from 'app/entities/gl-account/gl-account.model';
import { GLAccountService } from 'app/entities/gl-account/gl-account.service';
import { IAccountType, AccountType } from 'app/entities/account-type/account-type.model';
import { AccountTypeService } from 'app/entities/account-type/account-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPaymentMethodType | IGLAccount | IAccountType;

@Component({
  selector: 'jhi-payment-method-type-update',
  templateUrl: './payment-method-type-update.component.html',
})
export class PaymentMethodTypeUpdateComponent extends AbstractEntityUpdateComponent<IPaymentMethodType> {
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
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, paymentMethodTypeService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'paymentMethodTypeListModification';
  }

  protected initialState(): any {
    return { item: new PaymentMethodType(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
      if (params['defGLAccountId']) {
        this.defGLAccountId = params['defGLAccountId'];
      }
      if (params['accountTypeId']) {
        this.accountTypeId = params['accountTypeId'];
      }
    });

    this.paymentMethodTypeService.loadCacheAll().subscribe((res: IPaymentMethodType[]) => (this.paymentmethodtypes = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));

    this.accountTypeService.loadCacheAll().subscribe((res: IAccountType[]) => (this.accounttypes = res || []));
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
    return this.stateSubject.getValue().item.id;
  }

  get paymentMethodType() {
    return this.item;
  }
}
