import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPaymentGLAccountTypeMap, PaymentGLAccountTypeMap } from './payment-gl-account-type-map.model';
import { PaymentGLAccountTypeMapService } from './payment-gl-account-type-map.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPaymentType, PaymentType } from 'app/entities/payment-type/payment-type.model';
import { PaymentTypeService } from 'app/entities/payment-type/payment-type.service';
import { IGLAccountType, GLAccountType } from 'app/entities/gl-account-type/gl-account-type.model';
import { GLAccountTypeService } from 'app/entities/gl-account-type/gl-account-type.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';

type SelectableEntity = IPaymentType | IGLAccountType | IPartyGroup;

@Component({
  selector: 'jhi-payment-gl-account-type-map-view',
  templateUrl: './payment-gl-account-type-map-view.component.html',
})
export class PaymentGLAccountTypeMapViewComponent extends AbstractEntityBaseViewComponent<IPaymentGLAccountTypeMap> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  paymenttypes: IPaymentType[] = [];

  glaccounttypes: IGLAccountType[] = [];

  partygroups: IPartyGroup[] = [];
  paymentTypeId: string;
  glAccountTypeId: string;
  organizationId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected paymentGLAccountTypeMapService: PaymentGLAccountTypeMapService,
    protected paymentTypeService: PaymentTypeService,
    protected gLAccountTypeService: GLAccountTypeService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(paymentGLAccountTypeMapService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PaymentGLAccountTypeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PaymentGLAccountTypeMap();
        this.paymentGLAccountTypeMapService.find(this.id).subscribe(result => {
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

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
  }

  prepareView() {}

  get paymentGLAccountTypeMap() {
    return this.item;
  }

  set paymentGLAccountTypeMap(paymentGLAccountTypeMap: IPaymentGLAccountTypeMap) {
    this.item = paymentGLAccountTypeMap;
  }

  trackPaymentTypeById(index: number, item: IPaymentType) {
    return item.id;
  }

  trackGLAccountTypeById(index: number, item: IGLAccountType) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
