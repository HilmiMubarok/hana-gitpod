import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPaymentType, PaymentType } from './payment-type.model';
import { PaymentTypeService } from './payment-type.service';
import { IGLAccountType, GLAccountType } from 'app/entities/gl-account-type/gl-account-type.model';
import { GLAccountTypeService } from 'app/entities/gl-account-type/gl-account-type.service';
import { IAccountTransType, AccountTransType } from 'app/entities/account-trans-type/account-trans-type.model';
import { AccountTransTypeService } from 'app/entities/account-trans-type/account-trans-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPaymentType | IGLAccountType | IAccountTransType;

@Component({
  selector: 'jhi-payment-type-update',
  templateUrl: './payment-type-update.component.html',
})
export class PaymentTypeUpdateComponent extends AbstractEntityUpdateComponent<IPaymentType> {
  paymenttypes: IPaymentType[] = [];

  glaccounttypes: IGLAccountType[] = [];

  accounttranstypes: IAccountTransType[] = [];
  parentId: string;
  glAccountTypeId: number;
  accountTransTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected paymentTypeService: PaymentTypeService,
    protected gLAccountTypeService: GLAccountTypeService,
    protected accountTransTypeService: AccountTransTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, paymentTypeService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'paymentTypeListModification';
  }

  protected initialState(): any {
    return { item: new PaymentType(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
      if (params['glAccountTypeId']) {
        this.glAccountTypeId = params['glAccountTypeId'];
      }
      if (params['accountTransTypeId']) {
        this.accountTransTypeId = params['accountTransTypeId'];
      }
    });

    this.paymentTypeService.loadCacheAll().subscribe((res: IPaymentType[]) => (this.paymenttypes = res || []));

    this.gLAccountTypeService.loadCacheAll().subscribe((res: IGLAccountType[]) => (this.glaccounttypes = res || []));

    this.accountTransTypeService.loadCacheAll().subscribe((res: IAccountTransType[]) => (this.accounttranstypes = res || []));
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

  trackPaymentTypeById(index: number, item: IPaymentType) {
    return item.id;
  }

  trackGLAccountTypeById(index: number, item: IGLAccountType) {
    return item.id;
  }

  trackAccountTransTypeById(index: number, item: IAccountTransType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get paymentType() {
    return this.item;
  }
}
