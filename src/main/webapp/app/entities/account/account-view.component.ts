import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IAccount, Account } from './account.model';
import { AccountService } from './account.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IAccountType, AccountType } from 'app/entities/account-type/account-type.model';
import { AccountTypeService } from 'app/entities/account-type/account-type.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IAccountType | IInternal | IParty;

@Component({
  selector: 'jhi-account-view',
  templateUrl: './account-view.component.html',
})
export class AccountViewComponent extends AbstractEntityBaseViewComponent<IAccount> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  accounttypes: IAccountType[] = [];

  internals: IInternal[] = [];

  parties: IParty[] = [];
  accountTypeId: string;
  internalId: string;
  ownerId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected accountService: AccountService,
    protected accountTypeService: AccountTypeService,
    protected internalService: InternalService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(accountService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Account();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Account();
        this.accountService.find(this.id).subscribe(result => {
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
    this.accountTypeService.loadCacheAll().subscribe((res: IAccountType[]) => (this.accounttypes = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get account() {
    return this.item;
  }

  set account(account: IAccount) {
    this.item = account;
  }

  trackAccountTypeById(index: number, item: IAccountType) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
