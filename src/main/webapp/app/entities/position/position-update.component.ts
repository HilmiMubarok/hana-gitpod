import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPosition, Position } from './position.model';
import { PositionService } from './position.service';
import { IPositionType, PositionType } from 'app/entities/position-type/position-type.model';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { IEmployee, Employee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IPositionType | IEmployee | IInternal;

@Component({
  selector: 'jhi-position-update',
  templateUrl: './position-update.component.html',
})
export class PositionUpdateComponent extends AbstractEntityUpdateComponent<IPosition> {
  positiontypes: IPositionType[] = [];

  employees: IEmployee[] = [];

  internals: IInternal[] = [];
  positionTypeId: string;
  employeeId: number;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected positionService: PositionService,
    protected positionTypeService: PositionTypeService,
    protected employeeService: EmployeeService,
    protected internalService: InternalService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, positionService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'positionListModification';
  }

  protected initialState(): any {
    return { item: new Position(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['positionTypeId']) {
        this.positionTypeId = params['positionTypeId'];
      }
      if (params['employeeId']) {
        this.employeeId = params['employeeId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
    });

    this.positionTypeService.loadCacheAll().subscribe((res: IPositionType[]) => (this.positiontypes = res || []));

    this.employeeService.loadCacheAll().subscribe((res: IEmployee[]) => (this.employees = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));
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

  trackEmployeeById(index: number, item: IEmployee) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get position() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/Position/pdf', {});
    return false;
  }
}
