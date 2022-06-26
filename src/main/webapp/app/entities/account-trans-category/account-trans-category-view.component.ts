import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IAccountTransCategory, AccountTransCategory } from './account-trans-category.model';
import { AccountTransCategoryService } from './account-trans-category.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-account-trans-category-view',
  templateUrl: './account-trans-category-view.component.html',
})
export class AccountTransCategoryViewComponent extends AbstractEntityBaseViewComponent<IAccountTransCategory> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  accounttranscategories: IAccountTransCategory[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected accountTransCategoryService: AccountTransCategoryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(accountTransCategoryService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new AccountTransCategory();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new AccountTransCategory();
        this.accountTransCategoryService.find(this.id).subscribe(result => {
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
    this.accountTransCategoryService.loadCacheAll().subscribe((res: IAccountTransCategory[]) => (this.accounttranscategories = res || []));
  }

  prepareView() {}

  get accountTransCategory() {
    return this.item;
  }

  set accountTransCategory(accountTransCategory: IAccountTransCategory) {
    this.item = accountTransCategory;
  }

  trackAccountTransCategoryById(index: number, item: IAccountTransCategory) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
