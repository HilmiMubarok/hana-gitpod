import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFinAccount, FinAccount } from './fin-account.model';
import { FinAccountService } from './fin-account.service';
import { IAccountType, AccountType } from 'app/entities/account-type/account-type.model';
import { AccountTypeService } from 'app/entities/account-type/account-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IGLAccount, GLAccount } from 'app/entities/gl-account/gl-account.model';
import { GLAccountService } from 'app/entities/gl-account/gl-account.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IAccountType | IParty | IGLAccount;

@Component({
  selector: 'jhi-fin-account-update',
  templateUrl: './fin-account-update.component.html',
})
export class FinAccountUpdateComponent extends AbstractEntityUpdateComponent<IFinAccount> {
  accounttypes: IAccountType[] = [];

  parties: IParty[] = [];

  glaccounts: IGLAccount[] = [];
  accountTypeId: string;
  ownerId: string;
  glAccountId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected finAccountService: FinAccountService,
    protected accountTypeService: AccountTypeService,
    protected partyService: PartyService,
    protected gLAccountService: GLAccountService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, finAccountService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'finAccountListModification';
  }

  protected initialState(): any {
    return { item: new FinAccount(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['accountTypeId']) {
        this.accountTypeId = params['accountTypeId'];
      }
      if (params['ownerId']) {
        this.ownerId = params['ownerId'];
      }
      if (params['glAccountId']) {
        this.glAccountId = params['glAccountId'];
      }
    });

    this.accountTypeService.loadCacheAll().subscribe((res: IAccountType[]) => (this.accounttypes = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));
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

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackGLAccountById(index: number, item: IGLAccount) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get finAccount() {
    return this.item;
  }
}
