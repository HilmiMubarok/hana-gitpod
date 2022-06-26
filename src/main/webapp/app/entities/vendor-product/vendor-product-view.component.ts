import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IVendorProduct, VendorProduct } from './vendor-product.model';
import { VendorProductService } from './vendor-product.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';

type SelectableEntity = IProduct | IPartyGroup;

@Component({
  selector: 'jhi-vendor-product-view',
  templateUrl: './vendor-product-view.component.html',
})
export class VendorProductViewComponent extends AbstractEntityBaseViewComponent<IVendorProduct> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

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
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(vendorProductService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new VendorProduct();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new VendorProduct();
        this.vendorProductService.find(this.id).subscribe(result => {
          this.item = result.body;
          this.prepareView();
        });
      }
    }

    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }
      if (this.item) {
        this.prepareView();
      }
    }

    if (changes['isSaving'] && this.item.id) {
      if (this.isSaving) {
        this.save();
      }
    }
  }

  initialize() {
    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
  }

  prepareView() {}

  get vendorProduct() {
    return this.item;
  }

  set vendorProduct(vendorProduct: IVendorProduct) {
    this.item = vendorProduct;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
