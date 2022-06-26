import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IStateBoundary, StateBoundary } from './state-boundary.model';
import { StateBoundaryService } from './state-boundary.service';
import { IGeoBoundaryType, GeoBoundaryType } from 'app/entities/geo-boundary-type/geo-boundary-type.model';
import { GeoBoundaryTypeService } from 'app/entities/geo-boundary-type/geo-boundary-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IGeoBoundaryType | IStateBoundary;

@Component({
  selector: 'jhi-state-boundary-update',
  templateUrl: './state-boundary-update.component.html',
})
export class StateBoundaryUpdateComponent extends AbstractEntityUpdateComponent<IStateBoundary> {
  geoboundarytypes: IGeoBoundaryType[] = [];

  stateboundaries: IStateBoundary[] = [];
  boundaryTypeId: string;
  parentId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected stateBoundaryService: StateBoundaryService,
    protected geoBoundaryTypeService: GeoBoundaryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, stateBoundaryService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'stateBoundaryListModification';
  }

  protected initialState(): any {
    return { item: new StateBoundary(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['boundaryTypeId']) {
        this.boundaryTypeId = params['boundaryTypeId'];
      }
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
    });

    this.geoBoundaryTypeService.loadCacheAll().subscribe((res: IGeoBoundaryType[]) => (this.geoboundarytypes = res || []));

    this.stateBoundaryService.loadCacheAll().subscribe((res: IStateBoundary[]) => (this.stateboundaries = res || []));
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

  trackGeoBoundaryTypeById(index: number, item: IGeoBoundaryType) {
    return item.id;
  }

  trackStateBoundaryById(index: number, item: IStateBoundary) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get stateBoundary() {
    return this.item;
  }
}
