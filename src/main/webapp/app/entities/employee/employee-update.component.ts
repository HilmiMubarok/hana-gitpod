import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IEmployee, Employee } from './employee.model';
import { EmployeeService } from './employee.service';
import { IRoleType, RoleType } from 'app/entities/role-type/role-type.model';
import { RoleTypeService } from 'app/entities/role-type/role-type.service';
import { IPerson, Person } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IEmploymentType, EmploymentType } from 'app/entities/employment-type/employment-type.model';
import { EmploymentTypeService } from 'app/entities/employment-type/employment-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IRoleType | IPerson | IInternal | IEmploymentType;

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.component.html',
})
export class EmployeeUpdateComponent extends AbstractEntityUpdateComponent<IEmployee> {
  roletypes: IRoleType[] = [];

  people: IPerson[] = [];

  internals: IInternal[] = [];

  employmenttypes: IEmploymentType[] = [];
  roleId: string;
  personId: string;
  internalId: string;
  employmentTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected employeeService: EmployeeService,
    protected roleTypeService: RoleTypeService,
    protected personService: PersonService,
    protected internalService: InternalService,
    protected employmentTypeService: EmploymentTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, employeeService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'employeeListModification';
  }

  protected initialState(): any {
    return { item: new Employee(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['roleId']) {
        this.roleId = params['roleId'];
      }
      if (params['personId']) {
        this.personId = params['personId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
      if (params['employmentTypeId']) {
        this.employmentTypeId = params['employmentTypeId'];
      }
    });

    this.roleTypeService.loadCacheAll().subscribe((res: IRoleType[]) => (this.roletypes = res || []));

    this.personService.loadCacheAll().subscribe((res: IPerson[]) => (this.people = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    this.employmentTypeService.loadCacheAll().subscribe((res: IEmploymentType[]) => (this.employmenttypes = res || []));
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

  trackRoleTypeById(index: number, item: IRoleType) {
    return item.id;
  }

  trackPersonById(index: number, item: IPerson) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  trackEmploymentTypeById(index: number, item: IEmploymentType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get employee() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/Employee/pdf', {});
    return false;
  }
}
