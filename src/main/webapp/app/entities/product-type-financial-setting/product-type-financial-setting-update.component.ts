import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IProductTypeFinancialSetting, ProductTypeFinancialSetting } from './product-type-financial-setting.model';
import { ProductTypeFinancialSettingService } from './product-type-financial-setting.service';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-product-type-financial-setting-update',
  templateUrl: './product-type-financial-setting-update.component.html',
})
export class ProductTypeFinancialSettingUpdateComponent extends AbstractEntityUpdateComponent<IProductTypeFinancialSetting> {
  producttypes: IProductType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productTypeFinancialSettingService: ProductTypeFinancialSettingService,
    protected productTypeService: ProductTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, productTypeFinancialSettingService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'productTypeFinancialSettingListModification';
  }

  protected initialState(): any {
    return { item: new ProductTypeFinancialSetting(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
    });

    this.productTypeService.loadCacheAll().subscribe(
      (res: IProductType[]) => (this.producttypes = res.filter(t => t.id === 'FINANCIAL_PRODUCT' || t.parentId === 'FINANCIAL_PRODUCT') || [])
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

  get productTypeFinancialSetting() {
    return this.item;
  }
}
