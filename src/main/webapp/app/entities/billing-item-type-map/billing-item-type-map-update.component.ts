import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IBillingItemTypeMap, BillingItemTypeMap } from './billing-item-type-map.model';
import { BillingItemTypeMapService } from './billing-item-type-map.service';
import { IBillingType, BillingType } from 'app/entities/billing-type/billing-type.model';
import { BillingTypeService } from 'app/entities/billing-type/billing-type.service';
import { IBillingItemType, BillingItemType } from 'app/entities/billing-item-type/billing-item-type.model';
import { BillingItemTypeService } from 'app/entities/billing-item-type/billing-item-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBillingType | IBillingItemType;

@Component({
  selector: 'jhi-billing-item-type-map-update',
  templateUrl: './billing-item-type-map-update.component.html',
})
export class BillingItemTypeMapUpdateComponent extends AbstractEntityUpdateComponent<IBillingItemTypeMap> {
  billingtypes: IBillingType[] = [];

  billingitemtypes: IBillingItemType[] = [];
  billingTypeId: string;
  itemTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingItemTypeMapService: BillingItemTypeMapService,
    protected billingTypeService: BillingTypeService,
    protected billingItemTypeService: BillingItemTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, billingItemTypeMapService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'billingItemTypeMapListModification';
  }

  protected initialState(): any {
    return { item: new BillingItemTypeMap(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['billingTypeId']) {
        this.billingTypeId = params['billingTypeId'];
      }
      if (params['itemTypeId']) {
        this.itemTypeId = params['itemTypeId'];
      }
    });

    this.billingTypeService.loadCacheAll().subscribe((res: IBillingType[]) => (this.billingtypes = res || []));

    this.billingItemTypeService.loadCacheAll().subscribe((res: IBillingItemType[]) => (this.billingitemtypes = res || []));
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

  trackBillingTypeById(index: number, item: IBillingType) {
    return item.id;
  }

  trackBillingItemTypeById(index: number, item: IBillingItemType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get billingItemTypeMap() {
    return this.item;
  }
}
