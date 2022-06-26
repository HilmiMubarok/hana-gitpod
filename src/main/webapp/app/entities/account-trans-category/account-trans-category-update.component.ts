import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IAccountTransCategory, AccountTransCategory } from './account-trans-category.model';
import { AccountTransCategoryService } from './account-trans-category.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-account-trans-category-update',
  templateUrl: './account-trans-category-update.component.html',
})
export class AccountTransCategoryUpdateComponent extends AbstractEntityUpdateComponent<IAccountTransCategory> {
  accounttranscategories: IAccountTransCategory[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected accountTransCategoryService: AccountTransCategoryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, accountTransCategoryService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'accountTransCategoryListModification';
  }

  protected initialState(): any {
    return { item: new AccountTransCategory(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
    });

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

  trackAccountTransCategoryById(index: number, item: IAccountTransCategory) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get accountTransCategory() {
    return this.item;
  }
}
