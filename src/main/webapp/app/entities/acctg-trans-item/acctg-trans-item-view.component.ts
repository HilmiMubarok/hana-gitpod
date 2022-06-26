import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IAcctgTransItem, AcctgTransItem } from './acctg-trans-item.model';
import { AcctgTransItemService } from './acctg-trans-item.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IAcctgTrans, AcctgTrans } from 'app/entities/acctg-trans/acctg-trans.model';
import { AcctgTransService } from 'app/entities/acctg-trans/acctg-trans.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { IGLAccount, GLAccount } from 'app/entities/gl-account/gl-account.model';
import { GLAccountService } from 'app/entities/gl-account/gl-account.service';
import { IPeriod, Period } from 'app/entities/period/period.model';
import { PeriodService } from 'app/entities/period/period.service';

type SelectableEntity = IAcctgTrans | IPartyGroup | IGLAccount | IPeriod;

@Component({
  selector: 'jhi-acctg-trans-item-view',
  templateUrl: './acctg-trans-item-view.component.html',
})
export class AcctgTransItemViewComponent extends AbstractEntityBaseViewComponent<IAcctgTransItem> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  acctgtrans: IAcctgTrans[] = [];

  partygroups: IPartyGroup[] = [];

  glaccounts: IGLAccount[] = [];

  periods: IPeriod[] = [];
  transId: number;
  internalId: number;
  accountId: number;
  periodId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected acctgTransItemService: AcctgTransItemService,
    protected acctgTransService: AcctgTransService,
    protected partyGroupService: PartyGroupService,
    protected gLAccountService: GLAccountService,
    protected periodService: PeriodService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(acctgTransItemService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new AcctgTransItem();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new AcctgTransItem();
        this.acctgTransItemService.find(this.id).subscribe(result => {
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
    this.acctgTransService.loadCacheAll().subscribe((res: IAcctgTrans[]) => (this.acctgtrans = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));

    this.periodService.loadCacheAll().subscribe((res: IPeriod[]) => (this.periods = res || []));
  }

  prepareView() {}

  get acctgTransItem() {
    return this.item;
  }

  set acctgTransItem(acctgTransItem: IAcctgTransItem) {
    this.item = acctgTransItem;
  }

  trackAcctgTransById(index: number, item: IAcctgTrans) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  trackGLAccountById(index: number, item: IGLAccount) {
    return item.id;
  }

  trackPeriodById(index: number, item: IPeriod) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
