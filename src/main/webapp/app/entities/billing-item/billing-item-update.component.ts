import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IBillingItem, BillingItem } from './billing-item.model';
import { BillingItemService } from './billing-item.service';
import { IBilling, Billing } from 'app/entities/billing/billing.model';
import { BillingService } from 'app/entities/billing/billing.service';
import { IBillingItemType, BillingItemType } from 'app/entities/billing-item-type/billing-item-type.model';
import { BillingItemTypeService } from 'app/entities/billing-item-type/billing-item-type.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IFeature, Feature } from 'app/entities/feature/feature.model';
import { FeatureService } from 'app/entities/feature/feature.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBilling | IBillingItemType | IProduct | IFeature;

@Component({
  selector: 'jhi-billing-item-update',
  templateUrl: './billing-item-update.component.html',
})
export class BillingItemUpdateComponent extends AbstractEntityUpdateComponent<IBillingItem> {
  billings: IBilling[] = [];

  billingitemtypes: IBillingItemType[] = [];

  products: IProduct[] = [];

  features: IFeature[] = [];
  billingId: number;
  itemTypeId: string;
  productId: string;
  featureId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingItemService: BillingItemService,
    protected billingService: BillingService,
    protected billingItemTypeService: BillingItemTypeService,
    protected productService: ProductService,
    protected featureService: FeatureService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, billingItemService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'billingItemListModification';
  }

  protected initialState(): any {
    return { item: new BillingItem(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['billingId']) {
        this.billingId = params['billingId'];
      }
      if (params['itemTypeId']) {
        this.itemTypeId = params['itemTypeId'];
      }
      if (params['productId']) {
        this.productId = params['productId'];
      }
      if (params['featureId']) {
        this.featureId = params['featureId'];
      }
    });

    this.billingService.loadCacheAll().subscribe((res: IBilling[]) => (this.billings = res || []));

    this.billingItemTypeService.loadCacheAll().subscribe((res: IBillingItemType[]) => (this.billingitemtypes = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));

    this.featureService.loadCacheAll().subscribe((res: IFeature[]) => (this.features = res || []));
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

  trackBillingItemTypeById(index: number, item: IBillingItemType) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  trackFeatureById(index: number, item: IFeature) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get billingItem() {
    return this.item;
  }
}
