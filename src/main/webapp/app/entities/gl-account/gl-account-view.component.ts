import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IGLAccount, GLAccount } from './gl-account.model';
import { GLAccountService } from './gl-account.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IGLAccountType, GLAccountType } from 'app/entities/gl-account-type/gl-account-type.model';
import { GLAccountTypeService } from 'app/entities/gl-account-type/gl-account-type.service';
import { IGLAccountClass, GLAccountClass } from 'app/entities/gl-account-class/gl-account-class.model';
import { GLAccountClassService } from 'app/entities/gl-account-class/gl-account-class.service';
import { IGLResourceType, GLResourceType } from 'app/entities/gl-resource-type/gl-resource-type.model';
import { GLResourceTypeService } from 'app/entities/gl-resource-type/gl-resource-type.service';

type SelectableEntity = IGLAccountType | IGLAccountClass | IGLResourceType | IGLAccount;

@Component({
  selector: 'jhi-gl-account-view',
  templateUrl: './gl-account-view.component.html',
})
export class GLAccountViewComponent extends AbstractEntityBaseViewComponent<IGLAccount> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  glaccounttypes: IGLAccountType[] = [];

  glaccountclasses: IGLAccountClass[] = [];

  glresourcetypes: IGLResourceType[] = [];

  glaccounts: IGLAccount[] = [];
  accountTypeId: string;
  accountClassId: string;
  resourceTypeId: string;
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected gLAccountService: GLAccountService,
    protected gLAccountTypeService: GLAccountTypeService,
    protected gLAccountClassService: GLAccountClassService,
    protected gLResourceTypeService: GLResourceTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(gLAccountService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new GLAccount();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new GLAccount();
        this.gLAccountService.find(this.id).subscribe(result => {
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
    this.gLAccountTypeService.loadCacheAll().subscribe((res: IGLAccountType[]) => (this.glaccounttypes = res || []));

    this.gLAccountClassService.loadCacheAll().subscribe((res: IGLAccountClass[]) => (this.glaccountclasses = res || []));

    this.gLResourceTypeService.loadCacheAll().subscribe((res: IGLResourceType[]) => (this.glresourcetypes = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));
  }

  prepareView() {}

  get gLAccount() {
    return this.item;
  }

  set gLAccount(gLAccount: IGLAccount) {
    this.item = gLAccount;
  }

  trackGLAccountTypeById(index: number, item: IGLAccountType) {
    return item.id;
  }

  trackGLAccountClassById(index: number, item: IGLAccountClass) {
    return item.id;
  }

  trackGLResourceTypeById(index: number, item: IGLResourceType) {
    return item.id;
  }

  trackGLAccountById(index: number, item: IGLAccount) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
