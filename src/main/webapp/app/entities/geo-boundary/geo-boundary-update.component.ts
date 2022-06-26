import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IGeoBoundary, GeoBoundary } from './geo-boundary.model';
import { GeoBoundaryService } from './geo-boundary.service';
import { IGeoBoundaryType, GeoBoundaryType } from 'app/entities/geo-boundary-type/geo-boundary-type.model';
import { GeoBoundaryTypeService } from 'app/entities/geo-boundary-type/geo-boundary-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-geo-boundary-update',
  templateUrl: './geo-boundary-update.component.html',
})
export class GeoBoundaryUpdateComponent extends AbstractEntityUpdateComponent<IGeoBoundary> {
  geoboundarytypes: IGeoBoundaryType[] = [];
  boundaryTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected geoBoundaryService: GeoBoundaryService,
    protected geoBoundaryTypeService: GeoBoundaryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, geoBoundaryService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'geoBoundaryListModification';
  }

  protected initialState(): any {
    return { item: new GeoBoundary(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['boundaryTypeId']) {
        this.boundaryTypeId = params['boundaryTypeId'];
      }
    });

    this.geoBoundaryTypeService.loadCacheAll().subscribe((res: IGeoBoundaryType[]) => (this.geoboundarytypes = res || []));
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

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get geoBoundary() {
    return this.item;
  }
}
