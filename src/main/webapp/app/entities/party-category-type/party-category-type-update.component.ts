import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPartyCategoryType, PartyCategoryType } from './party-category-type.model';
import { PartyCategoryTypeService } from './party-category-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-party-category-type-update',
  templateUrl: './party-category-type-update.component.html',
})
export class PartyCategoryTypeUpdateComponent extends AbstractEntityUpdateComponent<IPartyCategoryType> {
  partycategorytypes: IPartyCategoryType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyCategoryTypeService: PartyCategoryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, partyCategoryTypeService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'partyCategoryTypeListModification';
  }

  protected initialState(): any {
    return { item: new PartyCategoryType(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
    });

    this.partyCategoryTypeService.loadCacheAll().subscribe((res: IPartyCategoryType[]) => (this.partycategorytypes = res || []));
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

  trackPartyCategoryTypeById(index: number, item: IPartyCategoryType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get partyCategoryType() {
    return this.item;
  }
}
