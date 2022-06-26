import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IAccountBalanced, AccountBalanced } from './account-balanced.model';
import { AccountBalancedService } from './account-balanced.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IBaseAccount, BaseAccount } from 'app/entities/base-account/base-account.model';
import { BaseAccountService } from 'app/entities/base-account/base-account.service';
import { IAccountTransCategory, AccountTransCategory } from 'app/entities/account-trans-category/account-trans-category.model';
import { AccountTransCategoryService } from 'app/entities/account-trans-category/account-trans-category.service';

type SelectableEntity = IBaseAccount | IAccountTransCategory;

@Component({
  selector: 'jhi-account-balanced-view',
  templateUrl: './account-balanced-view.component.html',
})
export class AccountBalancedViewComponent extends AbstractEntityBaseViewComponent<IAccountBalanced> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  baseaccounts: IBaseAccount[] = [];

  accounttranscategories: IAccountTransCategory[] = [];
  accountId: number;
  transCategoryId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected accountBalancedService: AccountBalancedService,
    protected baseAccountService: BaseAccountService,
    protected accountTransCategoryService: AccountTransCategoryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(accountBalancedService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new AccountBalanced();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new AccountBalanced();
        this.accountBalancedService.find(this.id).subscribe(result => {
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

    this.accountTransCategoryService.loadCacheAll().subscribe((res: IAccountTransCategory[]) => (this.accounttranscategories = res || []));
  }

  prepareView() {}

  get accountBalanced() {
    return this.item;
  }

  set accountBalanced(accountBalanced: IAccountBalanced) {
    this.item = accountBalanced;
  }

  trackBaseAccountById(index: number, item: IBaseAccount) {
    return item.id;
  }

  trackAccountTransCategoryById(index: number, item: IAccountTransCategory) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
