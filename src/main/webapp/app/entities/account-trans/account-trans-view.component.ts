import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IAccountTrans, AccountTrans } from './account-trans.model';
import { AccountTransService } from './account-trans.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IBaseAccount, BaseAccount } from 'app/entities/base-account/base-account.model';
import { BaseAccountService } from 'app/entities/base-account/base-account.service';
import { IAccountTransType, AccountTransType } from 'app/entities/account-trans-type/account-trans-type.model';
import { AccountTransTypeService } from 'app/entities/account-trans-type/account-trans-type.service';

type SelectableEntity = IBaseAccount | IAccountTransType;

@Component({
  selector: 'jhi-account-trans-view',
  templateUrl: './account-trans-view.component.html',
})
export class AccountTransViewComponent extends AbstractEntityBaseViewComponent<IAccountTrans> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  baseaccounts: IBaseAccount[] = [];

  accounttranstypes: IAccountTransType[] = [];
  accountId: number;
  transactionTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected accountTransService: AccountTransService,
    protected baseAccountService: BaseAccountService,
    protected accountTransTypeService: AccountTransTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(accountTransService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new AccountTrans();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new AccountTrans();
        this.accountTransService.find(this.id).subscribe(result => {
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
    this.baseAccountService.loadCacheAll().subscribe((res: IBaseAccount[]) => (this.baseaccounts = res || []));

    this.accountTransTypeService.loadCacheAll().subscribe((res: IAccountTransType[]) => (this.accounttranstypes = res || []));
  }

  prepareView() {}

  get accountTrans() {
    return this.item;
  }

  set accountTrans(accountTrans: IAccountTrans) {
    this.item = accountTrans;
  }

  trackBaseAccountById(index: number, item: IBaseAccount) {
    return item.id;
  }

  trackAccountTransTypeById(index: number, item: IAccountTransType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
