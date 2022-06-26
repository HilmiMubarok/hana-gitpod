import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IProductClassification, ProductClassification } from './product-classification.model';
import { ProductClassificationService } from './product-classification.service';
import { IProductCategory, ProductCategory } from 'app/entities/product-category/product-category.model';
import { ProductCategoryService } from 'app/entities/product-category/product-category.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IProductCategory | IProduct;

@Component({
  selector: 'jhi-product-classification-update',
  templateUrl: './product-classification-update.component.html',
})
export class ProductClassificationUpdateComponent extends AbstractEntityUpdateComponent<IProductClassification> {
  productcategories: IProductCategory[] = [];

  products: IProduct[] = [];
  categoryId: string;
  productId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productClassificationService: ProductClassificationService,
    protected productCategoryService: ProductCategoryService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, productClassificationService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'productClassificationListModification';
  }

  protected initialState(): any {
    return { item: new ProductClassification(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['categoryId']) {
        this.categoryId = params['categoryId'];
      }
      if (params['productId']) {
        this.productId = params['productId'];
      }
    });

    this.productCategoryService.loadCacheAll().subscribe((res: IProductCategory[]) => (this.productcategories = res || []));

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

  trackProductCategoryById(index: number, item: IProductCategory) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get productClassification() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/ProductClassification/pdf', {});
    return false;
  }
}
