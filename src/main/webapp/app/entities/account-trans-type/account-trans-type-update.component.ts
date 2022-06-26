import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IAccountTransType, AccountTransType } from './account-trans-type.model';
import { AccountTransTypeService } from './account-trans-type.service';
import { IAccountTransCategory, AccountTransCategory } from 'app/entities/account-trans-category/account-trans-category.model';
import { AccountTransCategoryService } from 'app/entities/account-trans-category/account-trans-category.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IAccountTransType | IAccountTransCategory;

@Component({
  selector: 'jhi-account-trans-type-update',
  templateUrl: './account-trans-type-update.component.html',
})
export class AccountTransTypeUpdateComponent extends AbstractEntityUpdateComponent<IAccountTransType> {
  accounttranstypes: IAccountTransType[] = [];

  accounttranscategories: IAccountTransCategory[] = [];
  parentId: string;
  transCategoryId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected accountTransTypeService: AccountTransTypeService,
    protected accountTransCategoryService: AccountTransCategoryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, accountTransTypeService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'accountTransTypeListModification';
  }

  protected initialState(): any {
    return { item: new AccountTransType(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
      if (params['transCategoryId']) {
        this.transCategoryId = params['transCategoryId'];
      }
    });

    this.accountTransTypeService.loadCacheAll().subscribe((res: IAccountTransType[]) => (this.accounttranstypes = res || []));

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

  trackAccountTransTypeById(index: number, item: IAccountTransType) {
    return item.id;
  }

  trackAccountTransCategoryById(index: number, item: IAccountTransCategory) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get accountTransType() {
    return this.item;
  }
}
