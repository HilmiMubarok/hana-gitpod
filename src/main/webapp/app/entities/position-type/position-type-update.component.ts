import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPositionType, PositionType } from './position-type.model';
import { PositionTypeService } from './position-type.service';
import { IInternalType, InternalType } from 'app/entities/internal-type/internal-type.model';
import { InternalTypeService } from 'app/entities/internal-type/internal-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IPositionType | IInternalType;

@Component({
  selector: 'jhi-position-type-update',
  templateUrl: './position-type-update.component.html',
})
export class PositionTypeUpdateComponent extends AbstractEntityUpdateComponent<IPositionType> {
  positiontypes: IPositionType[] = [];

  internaltypes: IInternalType[] = [];
  parentId: string;
  internalTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected positionTypeService: PositionTypeService,
    protected internalTypeService: InternalTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, positionTypeService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'positionTypeListModification';
  }

  protected initialState(): any {
    return { item: new PositionType(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
      if (params['internalTypeId']) {
        this.internalTypeId = params['internalTypeId'];
      }
    });

    this.positionTypeService.loadCacheAll().subscribe((res: IPositionType[]) => (this.positiontypes = res || []));

    this.internalTypeService.loadCacheAll().subscribe((res: IInternalType[]) => (this.internaltypes = res || []));
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

  trackPositionTypeById(index: number, item: IPositionType) {
    return item.id;
  }

  trackInternalTypeById(index: number, item: IInternalType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get positionType() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/PositionType/pdf', {});
    return false;
  }
}
