import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IGLAccountClass, GLAccountClass } from './gl-account-class.model';
import { GLAccountClassService } from './gl-account-class.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-gl-account-class-update',
  templateUrl: './gl-account-class-update.component.html',
})
export class GLAccountClassUpdateComponent extends AbstractEntityUpdateComponent<IGLAccountClass> {
  glaccountclasses: IGLAccountClass[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected gLAccountClassService: GLAccountClassService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, gLAccountClassService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'gLAccountClassListModification';
  }

  protected initialState(): any {
    return { item: new GLAccountClass(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
    });

    this.gLAccountClassService.loadCacheAll().subscribe((res: IGLAccountClass[]) => (this.glaccountclasses = res || []));
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

  trackGLAccountClassById(index: number, item: IGLAccountClass) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get gLAccountClass() {
    return this.item;
  }
}
