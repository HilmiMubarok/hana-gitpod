import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPaymentType, PaymentType } from './payment-type.model';
import { PaymentTypeService } from './payment-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IGLAccountType, GLAccountType } from 'app/entities/gl-account-type/gl-account-type.model';
import { GLAccountTypeService } from 'app/entities/gl-account-type/gl-account-type.service';
import { IAccountTransType, AccountTransType } from 'app/entities/account-trans-type/account-trans-type.model';
import { AccountTransTypeService } from 'app/entities/account-trans-type/account-trans-type.service';

type SelectableEntity = IPaymentType | IGLAccountType | IAccountTransType;

@Component({
  selector: 'jhi-payment-type-view',
  templateUrl: './payment-type-view.component.html',
})
export class PaymentTypeViewComponent extends AbstractEntityBaseViewComponent<IPaymentType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  paymenttypes: IPaymentType[] = [];

  glaccounttypes: IGLAccountType[] = [];

  accounttranstypes: IAccountTransType[] = [];
  parentId: string;
  glAccountTypeId: number;
  accountTransTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected paymentTypeService: PaymentTypeService,
    protected gLAccountTypeService: GLAccountTypeService,
    protected accountTransTypeService: AccountTransTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(paymentTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PaymentType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PaymentType();
        this.paymentTypeService.find(this.id).subscribe(result => {
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
    this.paymentTypeService.loadCacheAll().subscribe((res: IPaymentType[]) => (this.paymenttypes = res || []));

    this.gLAccountTypeService.loadCacheAll().subscribe((res: IGLAccountType[]) => (this.glaccounttypes = res || []));

    this.accountTransTypeService.loadCacheAll().subscribe((res: IAccountTransType[]) => (this.accounttranstypes = res || []));
  }

  prepareView() {}

  get paymentType() {
    return this.item;
  }

  set paymentType(paymentType: IPaymentType) {
    this.item = paymentType;
  }

  trackPaymentTypeById(index: number, item: IPaymentType) {
    return item.id;
  }

  trackGLAccountTypeById(index: number, item: IGLAccountType) {
    return item.id;
  }

  trackAccountTransTypeById(index: number, item: IAccountTransType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
