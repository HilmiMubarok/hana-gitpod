import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IDisbursement, Disbursement } from './disbursement.model';
import { DisbursementService } from './disbursement.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPaymentType, PaymentType } from 'app/entities/payment-type/payment-type.model';
import { PaymentTypeService } from 'app/entities/payment-type/payment-type.service';
import { IPaymentMethod, PaymentMethod } from 'app/entities/payment-method/payment-method.model';
import { PaymentMethodService } from 'app/entities/payment-method/payment-method.service';
import { IFinAccountTrans, FinAccountTrans } from 'app/entities/fin-account-trans/fin-account-trans.model';
import { FinAccountTransService } from 'app/entities/fin-account-trans/fin-account-trans.service';
import { IAcctgTrans, AcctgTrans } from 'app/entities/acctg-trans/acctg-trans.model';
import { AcctgTransService } from 'app/entities/acctg-trans/acctg-trans.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IPaymentType | IPaymentMethod | IFinAccountTrans | IAcctgTrans | IParty;

@Component({
  selector: 'jhi-disbursement-view',
  templateUrl: './disbursement-view.component.html',
})
export class DisbursementViewComponent extends AbstractEntityBaseViewComponent<IDisbursement> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  paymenttypes: IPaymentType[] = [];

  paymentmethods: IPaymentMethod[] = [];

  finaccounttrans: IFinAccountTrans[] = [];

  acctgtrans: IAcctgTrans[] = [];

  parties: IParty[] = [];
  paymentTypeId: string;
  paymentMethodId: number;
  accountTransId: number;
  acctgTransId: number;
  paidFromId: string;
  paidToId: string;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected disbursementService: DisbursementService,
    protected paymentTypeService: PaymentTypeService,
    protected paymentMethodService: PaymentMethodService,
    protected finAccountTransService: FinAccountTransService,
    protected acctgTransService: AcctgTransService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(disbursementService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Disbursement();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Disbursement();
        this.disbursementService.find(this.id).subscribe(result => {
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

    this.paymentMethodService.loadCacheAll().subscribe((res: IPaymentMethod[]) => (this.paymentmethods = res || []));

    this.finAccountTransService.loadCacheAll().subscribe((res: IFinAccountTrans[]) => (this.finaccounttrans = res || []));

    this.acctgTransService.loadCacheAll().subscribe((res: IAcctgTrans[]) => (this.acctgtrans = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get disbursement() {
    return this.item;
  }

  set disbursement(disbursement: IDisbursement) {
    this.item = disbursement;
  }

  trackPaymentTypeById(index: number, item: IPaymentType) {
    return item.id;
  }

  trackPaymentMethodById(index: number, item: IPaymentMethod) {
    return item.id;
  }

  trackFinAccountTransById(index: number, item: IFinAccountTrans) {
    return item.id;
  }

  trackAcctgTransById(index: number, item: IAcctgTrans) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
