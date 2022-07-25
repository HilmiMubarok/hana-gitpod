import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICreditFacility, CreditFacility } from './credit-facility.model';
import { CreditFacilityService } from './credit-facility.service';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-credit-facility-update',
  templateUrl: './credit-facility-update.component.html',
})
export class CreditFacilityUpdateComponent extends AbstractEntityUpdateComponent<ICreditFacility> {
  producttypes: IProductType[] = [];
  productTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected creditFacilityService: CreditFacilityService,
    protected productTypeService: ProductTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, creditFacilityService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'creditFacilityListModification';
  }

  protected initialState(): any {
    return { item: new CreditFacility(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['productTypeId']) {
        this.productTypeId = params['productTypeId'];
      }
    });

    this.productTypeService.loadCacheAll().subscribe((res: IProductType[]) => (this.producttypes = res || []));
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

  get creditFacility() {
    return this.item;
  }
}
