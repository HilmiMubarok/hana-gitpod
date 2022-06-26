import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFinAccountTrans, FinAccountTrans } from './fin-account-trans.model';
import { FinAccountTransService } from './fin-account-trans.service';
import { IBaseAccount, BaseAccount } from 'app/entities/base-account/base-account.model';
import { BaseAccountService } from 'app/entities/base-account/base-account.service';
import { IAccountTransType, AccountTransType } from 'app/entities/account-trans-type/account-trans-type.model';
import { AccountTransTypeService } from 'app/entities/account-trans-type/account-trans-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBaseAccount | IAccountTransType;

@Component({
  selector: 'jhi-fin-account-trans-update',
  templateUrl: './fin-account-trans-update.component.html',
})
export class FinAccountTransUpdateComponent extends AbstractEntityUpdateComponent<IFinAccountTrans> {
  baseaccounts: IBaseAccount[] = [];

  accounttranstypes: IAccountTransType[] = [];
  accountId: number;
  transactionTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected finAccountTransService: FinAccountTransService,
    protected baseAccountService: BaseAccountService,
    protected accountTransTypeService: AccountTransTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, finAccountTransService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'finAccountTransListModification';
  }

  protected initialState(): any {
    return { item: new FinAccountTrans(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['accountId']) {
        this.accountId = params['accountId'];
      }
      if (params['transactionTypeId']) {
        this.transactionTypeId = params['transactionTypeId'];
      }
    });

    this.baseAccountService.loadCacheAll().subscribe((res: IBaseAccount[]) => (this.baseaccounts = res || []));

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

  trackBaseAccountById(index: number, item: IBaseAccount) {
    return item.id;
  }

  trackAccountTransTypeById(index: number, item: IAccountTransType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get finAccountTrans() {
    return this.item;
  }
}
