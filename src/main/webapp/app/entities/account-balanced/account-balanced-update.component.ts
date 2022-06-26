import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IAccountBalanced, AccountBalanced } from './account-balanced.model';
import { AccountBalancedService } from './account-balanced.service';
import { IBaseAccount, BaseAccount } from 'app/entities/base-account/base-account.model';
import { BaseAccountService } from 'app/entities/base-account/base-account.service';
import { IAccountTransCategory, AccountTransCategory } from 'app/entities/account-trans-category/account-trans-category.model';
import { AccountTransCategoryService } from 'app/entities/account-trans-category/account-trans-category.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBaseAccount | IAccountTransCategory;

@Component({
  selector: 'jhi-account-balanced-update',
  templateUrl: './account-balanced-update.component.html',
})
export class AccountBalancedUpdateComponent extends AbstractEntityUpdateComponent<IAccountBalanced> {
  baseaccounts: IBaseAccount[] = [];

  accounttranscategories: IAccountTransCategory[] = [];
  accountId: number;
  transCategoryId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected accountBalancedService: AccountBalancedService,
    protected baseAccountService: BaseAccountService,
    protected accountTransCategoryService: AccountTransCategoryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, accountBalancedService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'accountBalancedListModification';
  }

  protected initialState(): any {
    return { item: new AccountBalanced(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['accountId']) {
        this.accountId = params['accountId'];
      }
      if (params['transCategoryId']) {
        this.transCategoryId = params['transCategoryId'];
      }
    });

    this.baseAccountService.loadCacheAll().subscribe((res: IBaseAccount[]) => (this.baseaccounts = res || []));

    this.accountTransCategoryService.loadCacheAll().subscribe((res: IAccountTransCategory[]) => (this.accounttranscategories = res || []));
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

  trackAccountTransCategoryById(index: number, item: IAccountTransCategory) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get accountBalanced() {
    return this.item;
  }
}
