import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IGoodIdentification, GoodIdentification } from './good-identification.model';
import { GoodIdentificationService } from './good-identification.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IIdentificationType, IdentificationType } from 'app/entities/identification-type/identification-type.model';
import { IdentificationTypeService } from 'app/entities/identification-type/identification-type.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';

type SelectableEntity = IIdentificationType | IProduct;

@Component({
  selector: 'jhi-good-identification-view',
  templateUrl: './good-identification-view.component.html',
})
export class GoodIdentificationViewComponent extends AbstractEntityBaseViewComponent<IGoodIdentification> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

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
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(goodIdentificationService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new GoodIdentification();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new GoodIdentification();
        this.goodIdentificationService.find(this.id).subscribe(result => {
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
    this.identificationTypeService.loadCacheAll().subscribe((res: IIdentificationType[]) => (this.identificationtypes = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));
  }

  prepareView() {}

  get goodIdentification() {
    return this.item;
  }

  set goodIdentification(goodIdentification: IGoodIdentification) {
    this.item = goodIdentification;
  }

  trackIdentificationTypeById(index: number, item: IIdentificationType) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
