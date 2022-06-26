import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IProductCategory, ProductCategory } from './product-category.model';
import { ProductCategoryService } from './product-category.service';
import { IProductCategoryType, ProductCategoryType } from 'app/entities/product-category-type/product-category-type.model';
import { ProductCategoryTypeService } from 'app/entities/product-category-type/product-category-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IProductCategory | IProductCategoryType;

@Component({
  selector: 'jhi-product-category-update',
  templateUrl: './product-category-update.component.html',
})
export class ProductCategoryUpdateComponent extends AbstractEntityUpdateComponent<IProductCategory> {
  productcategories: IProductCategory[] = [];

  productcategorytypes: IProductCategoryType[] = [];
  parentId: string;
  categoryTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productCategoryService: ProductCategoryService,
    protected productCategoryTypeService: ProductCategoryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, productCategoryService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'productCategoryListModification';
  }

  protected initialState(): any {
    return { item: new ProductCategory(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
      if (params['categoryTypeId']) {
        this.categoryTypeId = params['categoryTypeId'];
      }
    });

    this.productCategoryService.loadCacheAll().subscribe((res: IProductCategory[]) => (this.productcategories = res || []));

    this.productCategoryTypeService.loadCacheAll().subscribe((res: IProductCategoryType[]) => (this.productcategorytypes = res || []));
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

  trackProductCategoryById(index: number, item: IProductCategory) {
    return item.id;
  }

  trackProductCategoryTypeById(index: number, item: IProductCategoryType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get productCategory() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/ProductCategory/pdf', {});
    return false;
  }
}
