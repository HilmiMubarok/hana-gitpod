import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFeatureApplicable, FeatureApplicable } from './feature-applicable.model';
import { FeatureApplicableService } from './feature-applicable.service';
import { IFeature, Feature } from 'app/entities/feature/feature.model';
import { FeatureService } from 'app/entities/feature/feature.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IFeature | IProduct;

@Component({
  selector: 'jhi-feature-applicable-update',
  templateUrl: './feature-applicable-update.component.html',
})
export class FeatureApplicableUpdateComponent extends AbstractEntityUpdateComponent<IFeatureApplicable> {
  features: IFeature[] = [];

  products: IProduct[] = [];
  featureId: string;
  productId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected featureApplicableService: FeatureApplicableService,
    protected featureService: FeatureService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, featureApplicableService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'featureApplicableListModification';
  }

  protected initialState(): any {
    return { item: new FeatureApplicable(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['featureId']) {
        this.featureId = params['featureId'];
      }
      if (params['productId']) {
        this.productId = params['productId'];
      }
    });

    this.featureService.loadCacheAll().subscribe((res: IFeature[]) => (this.features = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));
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

  trackFeatureById(index: number, item: IFeature) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get featureApplicable() {
    return this.item;
  }
}
