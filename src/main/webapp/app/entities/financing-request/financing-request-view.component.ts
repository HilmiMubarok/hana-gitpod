import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFinancingRequest, FinancingRequest } from './financing-request.model';
import { FinancingRequestService } from './financing-request.service';
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

type SelectableEntity = IBillingType | IAcctgTrans | ISettlement;

@Component({
  selector: 'jhi-financing-request-view',
  templateUrl: './financing-request-view.component.html',
})
export class FinancingRequestViewComponent extends AbstractEntityBaseViewComponent<IFinancingRequest> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  billingtypes: IBillingType[] = [];

  acctgtrans: IAcctgTrans[] = [];

  settlements: ISettlement[] = [];
  billingTypeId: string;
  acctgTransId: number;
  settlementItems: ISettlement[] = [];
  settlementSelect: ISettlement;
  settlementId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected financingRequestService: FinancingRequestService,
    protected billingTypeService: BillingTypeService,
    protected acctgTransService: AcctgTransService,
    protected settlementService: SettlementService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(financingRequestService, messageService, elementRef, dataUtils, account, eventManager);
    this.settlementSelect = new Settlement();
    this.item = new FinancingRequest();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new FinancingRequest();
        this.financingRequestService.find(this.id).subscribe(result => {
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
  }

  prepareView() {
    if (this.financingRequest.settlementId) {
      this.settlementService.find(this.financingRequest.settlementId).subscribe(
        (value: HttpResponse<ISettlement>) => {
          this.settlementSelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  get financingRequest() {
    return this.item;
  }

  set financingRequest(financingRequest: IFinancingRequest) {
    this.item = financingRequest;
  }

  trackBillingTypeById(index: number, item: IBillingType) {
    return item.id;
  }

  trackAcctgTransById(index: number, item: IAcctgTrans) {
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
