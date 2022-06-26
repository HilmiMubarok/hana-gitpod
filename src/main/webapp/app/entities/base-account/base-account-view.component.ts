import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IBaseAccount, BaseAccount } from './base-account.model';
import { BaseAccountService } from './base-account.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IAccountType, AccountType } from 'app/entities/account-type/account-type.model';
import { AccountTypeService } from 'app/entities/account-type/account-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IAccountType | IParty;

@Component({
  selector: 'jhi-base-account-view',
  templateUrl: './base-account-view.component.html',
})
export class BaseAccountViewComponent extends AbstractEntityBaseViewComponent<IBaseAccount> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  accounttypes: IAccountType[] = [];

  parties: IParty[] = [];
  accountTypeId: string;
  ownerId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected baseAccountService: BaseAccountService,
    protected accountTypeService: AccountTypeService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(baseAccountService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new BaseAccount();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new BaseAccount();
        this.baseAccountService.find(this.id).subscribe(result => {
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

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get baseAccount() {
    return this.item;
  }

  set baseAccount(baseAccount: IBaseAccount) {
    this.item = baseAccount;
  }

  trackAccountTypeById(index: number, item: IAccountType) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
