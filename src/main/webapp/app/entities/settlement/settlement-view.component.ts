import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ISettlement, Settlement } from './settlement.model';
import { SettlementService } from './settlement.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { ISettlementType, SettlementType } from 'app/entities/settlement-type/settlement-type.model';
import { SettlementTypeService } from 'app/entities/settlement-type/settlement-type.service';
import { IPaymentMethod, PaymentMethod } from 'app/entities/payment-method/payment-method.model';
import { PaymentMethodService } from 'app/entities/payment-method/payment-method.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';

type SelectableEntity = ISettlementType | IPaymentMethod | IPartyGroup;

@Component({
  selector: 'jhi-settlement-view',
  templateUrl: './settlement-view.component.html',
})
export class SettlementViewComponent extends AbstractEntityBaseViewComponent<ISettlement> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  settlementtypes: ISettlementType[] = [];

  paymentmethods: IPaymentMethod[] = [];

  partygroups: IPartyGroup[] = [];
  settlementTypeId: string;
  paymentMethodId: string;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected settlementService: SettlementService,
    protected settlementTypeService: SettlementTypeService,
    protected paymentMethodService: PaymentMethodService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(settlementService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Settlement();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Settlement();
        this.settlementService.find(this.id).subscribe(result => {
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
    this.settlementTypeService.loadCacheAll().subscribe((res: ISettlementType[]) => (this.settlementtypes = res || []));

    this.paymentMethodService.loadCacheAll().subscribe((res: IPaymentMethod[]) => (this.paymentmethods = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
  }

  prepareView() {}

  get settlement() {
    return this.item;
  }

  set settlement(settlement: ISettlement) {
    this.item = settlement;
  }

  trackSettlementTypeById(index: number, item: ISettlementType) {
    return item.id;
  }

  trackPaymentMethodById(index: number, item: IPaymentMethod) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
