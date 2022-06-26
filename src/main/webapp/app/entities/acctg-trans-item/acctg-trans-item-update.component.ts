import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IAcctgTransItem, AcctgTransItem } from './acctg-trans-item.model';
import { AcctgTransItemService } from './acctg-trans-item.service';
import { IAcctgTrans, AcctgTrans } from 'app/entities/acctg-trans/acctg-trans.model';
import { AcctgTransService } from 'app/entities/acctg-trans/acctg-trans.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { IGLAccount, GLAccount } from 'app/entities/gl-account/gl-account.model';
import { GLAccountService } from 'app/entities/gl-account/gl-account.service';
import { IPeriod, Period } from 'app/entities/period/period.model';
import { PeriodService } from 'app/entities/period/period.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IAcctgTrans | IPartyGroup | IGLAccount | IPeriod;

@Component({
  selector: 'jhi-acctg-trans-item-update',
  templateUrl: './acctg-trans-item-update.component.html',
})
export class AcctgTransItemUpdateComponent extends AbstractEntityUpdateComponent<IAcctgTransItem> {
  acctgtrans: IAcctgTrans[] = [];

  partygroups: IPartyGroup[] = [];

  glaccounts: IGLAccount[] = [];

  periods: IPeriod[] = [];
  transId: number;
  internalId: number;
  accountId: number;
  periodId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected acctgTransItemService: AcctgTransItemService,
    protected acctgTransService: AcctgTransService,
    protected partyGroupService: PartyGroupService,
    protected gLAccountService: GLAccountService,
    protected periodService: PeriodService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, acctgTransItemService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'acctgTransItemListModification';
  }

  protected initialState(): any {
    return { item: new AcctgTransItem(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['transId']) {
        this.transId = params['transId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
      if (params['accountId']) {
        this.accountId = params['accountId'];
      }
      if (params['periodId']) {
        this.periodId = params['periodId'];
      }
    });

    this.acctgTransService.loadCacheAll().subscribe((res: IAcctgTrans[]) => (this.acctgtrans = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));

    this.periodService.loadCacheAll().subscribe((res: IPeriod[]) => (this.periods = res || []));
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

  trackAcctgTransById(index: number, item: IAcctgTrans) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  trackGLAccountById(index: number, item: IGLAccount) {
    return item.id;
  }

  trackPeriodById(index: number, item: IPeriod) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get acctgTransItem() {
    return this.item;
  }
}
