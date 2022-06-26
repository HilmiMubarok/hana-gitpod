import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IGood, Good } from './good.model';
import { GoodService } from './good.service';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { IProductConfig, ProductConfig } from 'app/entities/product-config/product-config.model';
import { ProductConfigService } from 'app/entities/product-config/product-config.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IProductType | IProductConfig;

@Component({
  selector: 'jhi-good-update',
  templateUrl: './good-update.component.html',
})
export class GoodUpdateComponent extends AbstractEntityUpdateComponent<IGood> {
  producttypes: IProductType[] = [];

  productconfigs: IProductConfig[] = [];
  productTypeId: string;
  configId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected goodService: GoodService,
    protected productTypeService: ProductTypeService,
    protected productConfigService: ProductConfigService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, goodService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'goodListModification';
  }

  protected initialState(): any {
    return { item: new Good(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['productTypeId']) {
        this.productTypeId = params['productTypeId'];
      }
      if (params['configId']) {
        this.configId = params['configId'];
      }
    });

    this.productTypeService.loadCacheAll()
      .subscribe((res: IProductType[]) => (this.producttypes = res.filter(x => x.parentId === 'GOOD' || x.id === 'GOOD') || []));
    this.productConfigService.loadCacheAll().subscribe((res: IProductConfig[]) => (this.productconfigs = res || []));
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

  trackProductConfigById(index: number, item: IProductConfig) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get good() {
    return this.item;
  }
}
