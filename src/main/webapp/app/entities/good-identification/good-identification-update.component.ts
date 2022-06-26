import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IGoodIdentification, GoodIdentification } from './good-identification.model';
import { GoodIdentificationService } from './good-identification.service';
import { IIdentificationType, IdentificationType } from 'app/entities/identification-type/identification-type.model';
import { IdentificationTypeService } from 'app/entities/identification-type/identification-type.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IIdentificationType | IProduct;

@Component({
  selector: 'jhi-good-identification-update',
  templateUrl: './good-identification-update.component.html',
})
export class GoodIdentificationUpdateComponent extends AbstractEntityUpdateComponent<IGoodIdentification> {
  identificationtypes: IIdentificationType[] = [];

  products: IProduct[] = [];
  identificationId: string;
  productId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected goodIdentificationService: GoodIdentificationService,
    protected identificationTypeService: IdentificationTypeService,
    protected productService: ProductService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, goodIdentificationService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'goodIdentificationListModification';
  }

  protected initialState(): any {
    return { item: new GoodIdentification(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['identificationId']) {
        this.identificationId = params['identificationId'];
      }
      if (params['productId']) {
        this.productId = params['productId'];
      }
    });

    this.identificationTypeService.loadCacheAll().subscribe((res: IIdentificationType[]) => (this.identificationtypes = res || []));

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

  trackIdentificationTypeById(index: number, item: IIdentificationType) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get goodIdentification() {
    return this.item;
  }
}
