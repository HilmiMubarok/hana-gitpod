import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IBillingTerm, BillingTerm } from './billing-term.model';
import { BillingTermService } from './billing-term.service';
import { IBilling, Billing } from 'app/entities/billing/billing.model';
import { BillingService } from 'app/entities/billing/billing.service';
import { ITermType, TermType } from 'app/entities/term-type/term-type.model';
import { TermTypeService } from 'app/entities/term-type/term-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBilling | ITermType;

@Component({
  selector: 'jhi-billing-term-update',
  templateUrl: './billing-term-update.component.html',
})
export class BillingTermUpdateComponent extends AbstractEntityUpdateComponent<IBillingTerm> {
  billings: IBilling[] = [];

  termtypes: ITermType[] = [];
  billingId: number;
  termTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingTermService: BillingTermService,
    protected billingService: BillingService,
    protected termTypeService: TermTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, billingTermService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'billingTermListModification';
  }

  protected initialState(): any {
    return { item: new BillingTerm(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['billingId']) {
        this.billingId = params['billingId'];
      }
      if (params['termTypeId']) {
        this.termTypeId = params['termTypeId'];
      }
    });

    this.billingService.loadCacheAll().subscribe((res: IBilling[]) => (this.billings = res || []));

    this.termTypeService.loadCacheAll().subscribe((res: ITermType[]) => (this.termtypes = res || []));
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

  trackBillingById(index: number, item: IBilling) {
    return item.id;
  }

  trackTermTypeById(index: number, item: ITermType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get billingTerm() {
    return this.item;
  }
}
