import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IInvoice, Invoice } from './invoice.model';
import { InvoiceService } from './invoice.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IBillingType, BillingType } from 'app/entities/billing-type/billing-type.model';
import { BillingTypeService } from 'app/entities/billing-type/billing-type.service';
import { IAcctgTrans, AcctgTrans } from 'app/entities/acctg-trans/acctg-trans.model';
import { AcctgTransService } from 'app/entities/acctg-trans/acctg-trans.service';
import { ISettlement, Settlement } from 'app/entities/settlement/settlement.model';
import { SettlementService } from 'app/entities/settlement/settlement.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IBillingType | IAcctgTrans | ISettlement | IParty;

@Component({
  selector: 'jhi-invoice-view',
  templateUrl: './invoice-view.component.html',
})
export class InvoiceViewComponent extends AbstractEntityBaseViewComponent<IInvoice> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  billingtypes: IBillingType[] = [];

  acctgtrans: IAcctgTrans[] = [];

  settlements: ISettlement[] = [];

  parties: IParty[] = [];
  billingTypeId: string;
  acctgTransId: number;
  settlementItems: ISettlement[] = [];
  settlementSelect: ISettlement;
  settlementId: number;
  billFromId: string;
  billToId: string;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected invoiceService: InvoiceService,
    protected billingTypeService: BillingTypeService,
    protected acctgTransService: AcctgTransService,
    protected settlementService: SettlementService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(invoiceService, messageService, elementRef, dataUtils, account, eventManager);
    this.settlementSelect = new Settlement();
    this.item = new Invoice();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Invoice();
        this.invoiceService.find(this.id).subscribe(result => {
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
    this.billingTypeService.loadCacheAll().subscribe((res: IBillingType[]) => (this.billingtypes = res || []));

    this.acctgTransService.loadCacheAll().subscribe((res: IAcctgTrans[]) => (this.acctgtrans = res || []));

    this.settlementService.loadCacheAll().subscribe((res: ISettlement[]) => (this.settlements = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {
    if (this.invoice.settlementId) {
      this.settlementService.find(this.invoice.settlementId).subscribe(
        (value: HttpResponse<ISettlement>) => {
          this.settlementSelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  get invoice() {
    return this.item;
  }

  set invoice(invoice: IInvoice) {
    this.item = invoice;
  }

  trackBillingTypeById(index: number, item: IBillingType) {
    return item.id;
  }

  trackAcctgTransById(index: number, item: IAcctgTrans) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  searchsettlement(event: any) {
    this.settlementService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<ISettlement[]>) => {
      this.settlementItems = res.body;
    });
  }

  selectsettlement(value: any) {
    this.item.settlementId = this.settlementSelect.id;
  }

  itemKey() {
    return this.item.id;
  }
}
