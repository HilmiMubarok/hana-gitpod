import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyPaymentPref, PartyPaymentPref } from './party-payment-pref.model';
import { PartyPaymentPrefService } from './party-payment-pref.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IPaymentMethodType, PaymentMethodType } from 'app/entities/payment-method-type/payment-method-type.model';
import { PaymentMethodTypeService } from 'app/entities/payment-method-type/payment-method-type.service';

type SelectableEntity = IParty | IPaymentMethodType;

@Component({
  selector: 'jhi-party-payment-pref-view',
  templateUrl: './party-payment-pref-view.component.html',
})
export class PartyPaymentPrefViewComponent extends AbstractEntityBaseViewComponent<IPartyPaymentPref> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  parties: IParty[] = [];

  paymentmethodtypes: IPaymentMethodType[] = [];
  partyId: string;
  paymentMethodTypeId: string;
  providerId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyPaymentPrefService: PartyPaymentPrefService,
    protected partyService: PartyService,
    protected paymentMethodTypeService: PaymentMethodTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partyPaymentPrefService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PartyPaymentPref();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PartyPaymentPref();
        this.partyPaymentPrefService.find(this.id).subscribe(result => {
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
    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.paymentMethodTypeService.loadCacheAll().subscribe((res: IPaymentMethodType[]) => (this.paymentmethodtypes = res || []));
  }

  prepareView() {}

  get partyPaymentPref() {
    return this.item;
  }

  set partyPaymentPref(partyPaymentPref: IPartyPaymentPref) {
    this.item = partyPaymentPref;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackPaymentMethodTypeById(index: number, item: IPaymentMethodType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
