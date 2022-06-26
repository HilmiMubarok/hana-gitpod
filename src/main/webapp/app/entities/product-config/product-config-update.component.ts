import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IProductConfig, ProductConfig } from './product-config.model';
import { ProductConfigService } from './product-config.service';
import { IUom, Uom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { ITaxType, TaxType } from 'app/entities/tax-type/tax-type.model';
import { TaxTypeService } from 'app/entities/tax-type/tax-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IUom | ITaxType;

@Component({
  selector: 'jhi-product-config-update',
  templateUrl: './product-config-update.component.html',
})
export class ProductConfigUpdateComponent extends AbstractEntityUpdateComponent<IProductConfig> {
  uoms: IUom[] = [];

  taxtypes: ITaxType[] = [];
  uomId: string;
  purchaseTaxId: string;
  salesTaxId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected productConfigService: ProductConfigService,
    protected uomService: UomService,
    protected taxTypeService: TaxTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, productConfigService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'productConfigListModification';
  }

  protected initialState(): any {
    return { item: new ProductConfig(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['uomId']) {
        this.uomId = params['uomId'];
      }
      if (params['purchaseTaxId']) {
        this.purchaseTaxId = params['purchaseTaxId'];
      }
      if (params['salesTaxId']) {
        this.salesTaxId = params['salesTaxId'];
      }
    });

    this.uomService.loadCacheAll().subscribe((res: IUom[]) => (this.uoms = res || []));

    this.taxTypeService.loadCacheAll().subscribe((res: ITaxType[]) => (this.taxtypes = res || []));
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

  trackUomById(index: number, item: IUom) {
    return item.id;
  }

  trackTaxTypeById(index: number, item: ITaxType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get productConfig() {
    return this.item;
  }
}
