import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFinancialProduct, FinancialProduct } from './financial-product.model';
import { FinancialProductService } from './financial-product.service';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-financial-product-update',
  templateUrl: './financial-product-update.component.html',
})
export class FinancialProductUpdateComponent extends AbstractEntityUpdateComponent<IFinancialProduct> {
  producttypes: IProductType[] = [];
  productTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected financialProductService: FinancialProductService,
    protected productTypeService: ProductTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, financialProductService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'financialProductListModification';
  }

  protected initialState(): any {
    return { item: new FinancialProduct(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['productTypeId']) {
        this.productTypeId = params['productTypeId'];
      }
    });

    this.productTypeService.loadCacheAll().subscribe(
      (res: IProductType[]) => (this.producttypes = res.filter(p => p.id === 'FINANCIAL_PRODUCT' || p.parentId === 'FINANCIAL_PRODUCT') || [])
    );
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

  get financialProduct() {
    return this.item;
  }
}
