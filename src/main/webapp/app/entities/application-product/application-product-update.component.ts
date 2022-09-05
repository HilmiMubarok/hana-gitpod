import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IApplicationProduct, ApplicationProduct } from './application-product.model';
import { ApplicationProductService } from './application-product.service';
import { IBaseApplication, BaseApplication } from 'app/entities/base-application/base-application.model';
import { BaseApplicationService } from 'app/entities/base-application/base-application.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBaseApplication | IProduct;

@Component({
  selector: 'jhi-application-product-update',
  templateUrl: './application-product-update.component.html',
})
export class ApplicationProductUpdateComponent extends AbstractEntityUpdateComponent<IApplicationProduct> {
  baseapplications: IBaseApplication[] = [];

  products: IProduct[] = [];
  applicationId: number;
  productId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected applicationProductService: ApplicationProductService,
    protected baseApplicationService: BaseApplicationService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, applicationProductService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'applicationProductListModification';
  }

  protected initialState(): any {
    return { item: new ApplicationProduct(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['applicationId']) {
        this.applicationId = params['applicationId'];
      }
      if (params['productId']) {
        this.productId = params['productId'];
      }
    });

    this.baseApplicationService.loadCacheAll().subscribe((res: IBaseApplication[]) => (this.baseapplications = res || []));

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

  trackBaseApplicationById(index: number, item: IBaseApplication) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get applicationProduct() {
    return this.item;
  }
}
