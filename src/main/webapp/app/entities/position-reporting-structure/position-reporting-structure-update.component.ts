import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPositionReportingStructure, PositionReportingStructure } from './position-reporting-structure.model';
import { PositionReportingStructureService } from './position-reporting-structure.service';
import { IRelationType, RelationType } from 'app/entities/relation-type/relation-type.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';
import { IPosition, Position } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IRelationType | IPosition;

@Component({
  selector: 'jhi-position-reporting-structure-update',
  templateUrl: './position-reporting-structure-update.component.html',
})
export class PositionReportingStructureUpdateComponent extends AbstractEntityUpdateComponent<IPositionReportingStructure> {
  relationtypes: IRelationType[] = [];

  positions: IPosition[] = [];
  relationTypeId: string;
  positionFromId: number;
  positionToId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected positionReportingStructureService: PositionReportingStructureService,
    protected relationTypeService: RelationTypeService,
    protected positionService: PositionService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, positionReportingStructureService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'positionReportingStructureListModification';
  }

  protected initialState(): any {
    return { item: new PositionReportingStructure(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['relationTypeId']) {
        this.relationTypeId = params['relationTypeId'];
      }
      if (params['positionFromId']) {
        this.positionFromId = params['positionFromId'];
      }
      if (params['positionToId']) {
        this.positionToId = params['positionToId'];
      }
    });

    this.relationTypeService.loadCacheAll().subscribe((res: IRelationType[]) => (this.relationtypes = res || []));

    this.positionService.loadCacheAll().subscribe((res: IPosition[]) => (this.positions = res || []));
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

  trackRelationTypeById(index: number, item: IRelationType) {
    return item.id;
  }

  trackPositionById(index: number, item: IPosition) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get positionReportingStructure() {
    return this.item;
  }
}
