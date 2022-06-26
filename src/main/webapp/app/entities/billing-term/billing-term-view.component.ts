import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IBillingTerm, BillingTerm } from './billing-term.model';
import { BillingTermService } from './billing-term.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IBilling, Billing } from 'app/entities/billing/billing.model';
import { BillingService } from 'app/entities/billing/billing.service';
import { ITermType, TermType } from 'app/entities/term-type/term-type.model';
import { TermTypeService } from 'app/entities/term-type/term-type.service';

type SelectableEntity = IBilling | ITermType;

@Component({
  selector: 'jhi-billing-term-view',
  templateUrl: './billing-term-view.component.html',
})
export class BillingTermViewComponent extends AbstractEntityBaseViewComponent<IBillingTerm> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  billings: IBilling[] = [];

  termtypes: ITermType[] = [];
  billingId: number;
  termTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected billingTermService: BillingTermService,
    protected billingService: BillingService,
    protected termTypeService: TermTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(billingTermService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new BillingTerm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new BillingTerm();
        this.billingTermService.find(this.id).subscribe(result => {
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
    this.billingService.loadCacheAll().subscribe((res: IBilling[]) => (this.billings = res || []));

    this.termTypeService.loadCacheAll().subscribe((res: ITermType[]) => (this.termtypes = res || []));
  }

  prepareView() {}

  get billingTerm() {
    return this.item;
  }

  set billingTerm(billingTerm: IBillingTerm) {
    this.item = billingTerm;
  }

  trackBillingById(index: number, item: IBilling) {
    return item.id;
  }

  trackTermTypeById(index: number, item: ITermType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
