import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';

import { IProductTypeConfig, ProductTypeConfig } from './product-type-config.model';
import { ProductTypeConfigService } from './product-type-config.service';
import { IProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { IFeatureType } from '../feature-type/feature-type.model';
import { FeatureTypeService } from '../feature-type/feature-type.service';

@Component({
  selector: 'jhi-product-type-config-update',
  templateUrl: './product-type-config-update.component.html',
})
export class ProductTypeConfigUpdateComponent extends AbstractEntityUpdateComponent<IProductTypeConfig> {
  producttypes: IProductType[] = [];
  parentId: string;
  availableFeatureTypes: IFeatureType[] = [];

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productTypeConfigService: ProductTypeConfigService,
    protected productTypeService: ProductTypeService,
    protected featureTypeService: FeatureTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, productTypeConfigService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'productTypeConfigListModification';
  }

  protected initialState(): any {
    return { item: new ProductTypeConfig(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
    });

    this.productTypeService.loadCacheAll().subscribe((res: IProductType[]) => (this.producttypes = res || []));
    this.featureTypeService.loadCacheAll().subscribe((res: IFeatureType[]) => {
      this.availableFeatureTypes = res || [];
    });
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

  trackProductTypeById(index: number, item: IProductType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get productTypeConfig() {
    return this.item;
  }
}
