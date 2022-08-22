import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFinServiceAccount, FinServiceAccount } from './fin-service-account.model';
import { FinServiceAccountService } from './fin-service-account.service';
import { IAccountType, AccountType } from 'app/entities/account-type/account-type.model';
import { AccountTypeService } from 'app/entities/account-type/account-type.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IStatusItem, StatusItem } from 'app/entities/status-item/status-item.model';
import { StatusItemService } from 'app/entities/status-item/status-item.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IAccountType | IInternal | IParty | IStatusItem;

@Component({
  selector: 'jhi-fin-service-account-update',
  templateUrl: './fin-service-account-update.component.html',
})
export class FinServiceAccountUpdateComponent extends AbstractEntityUpdateComponent<IFinServiceAccount> {
  accounttypes: IAccountType[] = [];

  internals: IInternal[] = [];

  parties: IParty[] = [];

  statusitems: IStatusItem[] = [];
  accountTypeId: string;
  internalId: string;
  ownerId: string;
  statusId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected finServiceAccountService: FinServiceAccountService,
    protected accountTypeService: AccountTypeService,
    protected internalService: InternalService,
    protected partyService: PartyService,
    protected statusItemService: StatusItemService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, finServiceAccountService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'finServiceAccountListModification';
  }

  protected initialState(): any {
    return { item: new FinServiceAccount(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['accountTypeId']) {
        this.accountTypeId = params['accountTypeId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
      if (params['ownerId']) {
        this.ownerId = params['ownerId'];
      }
      if (params['statusId']) {
        this.statusId = params['statusId'];
      }
    });

    this.accountTypeService.loadCacheAll().subscribe((res: IAccountType[]) => (this.accounttypes = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.statusItemService.loadCacheAll().subscribe((res: IStatusItem[]) => (this.statusitems = res || []));
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

  trackAccountTypeById(index: number, item: IAccountType) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackStatusItemById(index: number, item: IStatusItem) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get finServiceAccount() {
    return this.item;
  }
}
