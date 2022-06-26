import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IAcctgTrans, AcctgTrans } from './acctg-trans.model';
import { AcctgTransService } from './acctg-trans.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IAcctgTransType, AcctgTransType } from 'app/entities/acctg-trans-type/acctg-trans-type.model';
import { AcctgTransTypeService } from 'app/entities/acctg-trans-type/acctg-trans-type.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';

type SelectableEntity = IAcctgTransType | IPartyGroup;

@Component({
  selector: 'jhi-acctg-trans-view',
  templateUrl: './acctg-trans-view.component.html',
})
export class AcctgTransViewComponent extends AbstractEntityBaseViewComponent<IAcctgTrans> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  acctgtranstypes: IAcctgTransType[] = [];

  partygroups: IPartyGroup[] = [];
  transTypeId: string;
  internalId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected acctgTransService: AcctgTransService,
    protected acctgTransTypeService: AcctgTransTypeService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(acctgTransService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new AcctgTrans();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new AcctgTrans();
        this.acctgTransService.find(this.id).subscribe(result => {
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
    this.acctgTransTypeService.loadCacheAll().subscribe((res: IAcctgTransType[]) => (this.acctgtranstypes = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
  }

  prepareView() {}

  get acctgTrans() {
    return this.item;
  }

  set acctgTrans(acctgTrans: IAcctgTrans) {
    this.item = acctgTrans;
  }

  trackAcctgTransTypeById(index: number, item: IAcctgTransType) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
