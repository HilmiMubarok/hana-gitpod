import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPaymentMethod, PaymentMethod } from './payment-method.model';
import { PaymentMethodService } from './payment-method.service';
import { IPaymentMethodType, PaymentMethodType } from 'app/entities/payment-method-type/payment-method-type.model';
import { PaymentMethodTypeService } from 'app/entities/payment-method-type/payment-method-type.service';
import { IGLAccount, GLAccount } from 'app/entities/gl-account/gl-account.model';
import { GLAccountService } from 'app/entities/gl-account/gl-account.service';
import { IFinAccount, FinAccount } from 'app/entities/fin-account/fin-account.model';
import { FinAccountService } from 'app/entities/fin-account/fin-account.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPaymentMethodType | IGLAccount | IFinAccount | IParty;

@Component({
  selector: 'jhi-payment-method-update',
  templateUrl: './payment-method-update.component.html',
})
export class PaymentMethodUpdateComponent extends AbstractEntityUpdateComponent<IPaymentMethod> {
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
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, paymentMethodService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'paymentMethodListModification';
  }

  protected initialState(): any {
    return { item: new PaymentMethod(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['paymentMethodTypeId']) {
        this.paymentMethodTypeId = params['paymentMethodTypeId'];
      }
      if (params['glAccountId']) {
        this.glAccountId = params['glAccountId'];
      }
      if (params['finAccountId']) {
        this.finAccountId = params['finAccountId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
      if (params['providerId']) {
        this.providerId = params['providerId'];
      }
    });

    this.paymentMethodTypeService.loadCacheAll().subscribe((res: IPaymentMethodType[]) => (this.paymentmethodtypes = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));

    this.finAccountService.loadCacheAll().subscribe((res: IFinAccount[]) => (this.finaccounts = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
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

  trackFinAccountById(index: number, item: IFinAccount) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get paymentMethod() {
    return this.item;
  }
}
