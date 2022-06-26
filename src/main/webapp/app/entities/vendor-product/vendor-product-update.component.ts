import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IVendorProduct, VendorProduct } from './vendor-product.model';
import { VendorProductService } from './vendor-product.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IProduct | IPartyGroup;

@Component({
  selector: 'jhi-vendor-product-update',
  templateUrl: './vendor-product-update.component.html',
})
export class VendorProductUpdateComponent extends AbstractEntityUpdateComponent<IVendorProduct> {
  products: IProduct[] = [];

  partygroups: IPartyGroup[] = [];
  productId: number;
  organizationId: string;
  vendorId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected vendorProductService: VendorProductService,
    protected productService: ProductService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, vendorProductService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'vendorProductListModification';
  }

  protected initialState(): any {
    return { item: new VendorProduct(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['productId']) {
        this.productId = params['productId'];
      }
      if (params['organizationId']) {
        this.organizationId = params['organizationId'];
      }
      if (params['vendorId']) {
        this.vendorId = params['vendorId'];
      }
    });

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
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

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get vendorProduct() {
    return this.item;
  }
}
