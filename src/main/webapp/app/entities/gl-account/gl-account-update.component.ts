import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IGLAccount, GLAccount } from './gl-account.model';
import { GLAccountService } from './gl-account.service';
import { IGLAccountType, GLAccountType } from 'app/entities/gl-account-type/gl-account-type.model';
import { GLAccountTypeService } from 'app/entities/gl-account-type/gl-account-type.service';
import { IGLAccountClass, GLAccountClass } from 'app/entities/gl-account-class/gl-account-class.model';
import { GLAccountClassService } from 'app/entities/gl-account-class/gl-account-class.service';
import { IGLResourceType, GLResourceType } from 'app/entities/gl-resource-type/gl-resource-type.model';
import { GLResourceTypeService } from 'app/entities/gl-resource-type/gl-resource-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IGLAccountType | IGLAccountClass | IGLResourceType | IGLAccount;

@Component({
  selector: 'jhi-gl-account-update',
  templateUrl: './gl-account-update.component.html',
})
export class GLAccountUpdateComponent extends AbstractEntityUpdateComponent<IGLAccount> {
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
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, gLAccountService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'gLAccountListModification';
  }

  protected initialState(): any {
    return { item: new GLAccount(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['accountTypeId']) {
        this.accountTypeId = params['accountTypeId'];
      }
      if (params['accountClassId']) {
        this.accountClassId = params['accountClassId'];
      }
      if (params['resourceTypeId']) {
        this.resourceTypeId = params['resourceTypeId'];
      }
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
    });

    this.gLAccountTypeService.loadCacheAll().subscribe((res: IGLAccountType[]) => (this.glaccounttypes = res || []));

    this.gLAccountClassService.loadCacheAll().subscribe((res: IGLAccountClass[]) => (this.glaccountclasses = res || []));

    this.gLResourceTypeService.loadCacheAll().subscribe((res: IGLResourceType[]) => (this.glresourcetypes = res || []));

    this.gLAccountService.loadCacheAll().subscribe((res: IGLAccount[]) => (this.glaccounts = res || []));
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state);
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
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
    return this.stateSubject.getValue().item.id;
  }

  get gLAccount() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/GLAccount/pdf', {});
    return false;
  }
}
