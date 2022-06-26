import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IBilling, Billing } from './billing.model';
import { BillingService } from './billing.service';
import { IBillingType, BillingType } from 'app/entities/billing-type/billing-type.model';
import { BillingTypeService } from 'app/entities/billing-type/billing-type.service';
import { IAcctgTrans, AcctgTrans } from 'app/entities/acctg-trans/acctg-trans.model';
import { AcctgTransService } from 'app/entities/acctg-trans/acctg-trans.service';
import { ISettlement, Settlement } from 'app/entities/settlement/settlement.model';
import { SettlementService } from 'app/entities/settlement/settlement.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBillingType | IAcctgTrans | ISettlement | IParty;

@Component({
  selector: 'jhi-billing-update',
  templateUrl: './billing-update.component.html',
})
export class BillingUpdateComponent extends AbstractEntityUpdateComponent<IBilling> {
  billingtypes: IBillingType[] = [];

  acctgtrans: IAcctgTrans[] = [];

  settlements: ISettlement[] = [];

  parties: IParty[] = [];
  billingTypeId: string;
  acctgTransId: number;
  settlementItems: ISettlement[];
  settlementSelect: ISettlement;
  settlementId: number;
  billFromId: string;
  billToId: string;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingService: BillingService,
    protected billingTypeService: BillingTypeService,
    protected acctgTransService: AcctgTransService,
    protected settlementService: SettlementService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, billingService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.settlementSelect = new Settlement();
    this.listChangeEventName = 'billingListModification';
  }

  protected initialState(): any {
    return { item: new Billing(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['billingTypeId']) {
        this.billingTypeId = params['billingTypeId'];
      }
      if (params['acctgTransId']) {
        this.acctgTransId = params['acctgTransId'];
      }
      if (params['settlementId']) {
        this.settlementId = params['settlementId'];
      }
      if (params['billFromId']) {
        this.billFromId = params['billFromId'];
      }
      if (params['billToId']) {
        this.billToId = params['billToId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
    });

    this.billingTypeService.loadCacheAll().subscribe((res: IBillingType[]) => (this.billingtypes = res || []));

    this.acctgTransService.loadCacheAll().subscribe((res: IAcctgTrans[]) => (this.acctgtrans = res || []));

    this.settlementService.loadCacheAll().subscribe((res: ISettlement[]) => (this.settlements = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state).pipe(
      mergeMap(currState =>
        this.settlementService.find(state.item.settlementId).pipe(
          map(res => res.body),
          catchError(res => of(new Settlement())),
          map(res => {
            this.settlementSelect = res;
            return currState;
          })
        )
      )
    );
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
  }

  trackBillingTypeById(index: number, item: IBillingType) {
    return item.id;
  }

  trackAcctgTransById(index: number, item: IAcctgTrans) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get billing() {
    return this.item;
  }

  searchsettlement(event: any) {
    this.settlementService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<ISettlement[]>) => {
      this.settlementItems = res.body;
    });
  }

  selectsettlement(value: any) {
    this.item.settlementId = this.settlementSelect.id;
  }
}
