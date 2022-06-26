import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ISettlement, Settlement } from './settlement.model';
import { SettlementService } from './settlement.service';
import { ISettlementType, SettlementType } from 'app/entities/settlement-type/settlement-type.model';
import { SettlementTypeService } from 'app/entities/settlement-type/settlement-type.service';
import { IPaymentMethod, PaymentMethod } from 'app/entities/payment-method/payment-method.model';
import { PaymentMethodService } from 'app/entities/payment-method/payment-method.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = ISettlementType | IPaymentMethod | IPartyGroup;

@Component({
  selector: 'jhi-settlement-update',
  templateUrl: './settlement-update.component.html',
})
export class SettlementUpdateComponent extends AbstractEntityUpdateComponent<ISettlement> {
  settlementtypes: ISettlementType[] = [];

  paymentmethods: IPaymentMethod[] = [];

  partygroups: IPartyGroup[] = [];
  settlementTypeId: string;
  paymentMethodId: string;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected settlementService: SettlementService,
    protected settlementTypeService: SettlementTypeService,
    protected paymentMethodService: PaymentMethodService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, settlementService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'settlementListModification';
  }

  protected initialState(): any {
    return { item: new Settlement(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['settlementTypeId']) {
        this.settlementTypeId = params['settlementTypeId'];
      }
      if (params['paymentMethodId']) {
        this.paymentMethodId = params['paymentMethodId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
    });

    this.settlementTypeService.loadCacheAll().subscribe((res: ISettlementType[]) => (this.settlementtypes = res || []));

    this.paymentMethodService.loadCacheAll().subscribe((res: IPaymentMethod[]) => (this.paymentmethods = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
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

  trackSettlementTypeById(index: number, item: ISettlementType) {
    return item.id;
  }

  trackPaymentMethodById(index: number, item: IPaymentMethod) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get settlement() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/Settlement/pdf', {});
    return false;
  }
}
