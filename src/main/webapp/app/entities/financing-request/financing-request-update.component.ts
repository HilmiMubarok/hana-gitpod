import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFinancingRequest, FinancingRequest } from './financing-request.model';
import { FinancingRequestService } from './financing-request.service';
import { IBillingType, BillingType } from 'app/entities/billing-type/billing-type.model';
import { BillingTypeService } from 'app/entities/billing-type/billing-type.service';
import { IAcctgTrans, AcctgTrans } from 'app/entities/acctg-trans/acctg-trans.model';
import { AcctgTransService } from 'app/entities/acctg-trans/acctg-trans.service';
import { ISettlement, Settlement } from 'app/entities/settlement/settlement.model';
import { SettlementService } from 'app/entities/settlement/settlement.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBillingType | IAcctgTrans | ISettlement;

@Component({
  selector: 'jhi-financing-request-update',
  templateUrl: './financing-request-update.component.html',
})
export class FinancingRequestUpdateComponent extends AbstractEntityUpdateComponent<IFinancingRequest> {
  billingtypes: IBillingType[] = [];

  acctgtrans: IAcctgTrans[] = [];

  settlements: ISettlement[] = [];
  billingTypeId: string;
  acctgTransId: number;
  settlementItems: ISettlement[];
  settlementSelect: ISettlement;
  settlementId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected financingRequestService: FinancingRequestService,
    protected billingTypeService: BillingTypeService,
    protected acctgTransService: AcctgTransService,
    protected settlementService: SettlementService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, financingRequestService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.settlementSelect = new Settlement();
    this.listChangeEventName = 'financingRequestListModification';
  }

  protected initialState(): any {
    return { item: new FinancingRequest(), tasks: [], id: undefined };
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
    });

    this.billingTypeService.loadCacheAll().subscribe((res: IBillingType[]) => (this.billingtypes = res || []));
    this.acctgTransService.loadCacheAll().subscribe((res: IAcctgTrans[]) => (this.acctgtrans = res || []));
    this.settlementService.loadCacheAll().subscribe((res: ISettlement[]) => (this.settlements = res || []));
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

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get financingRequest() {
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
