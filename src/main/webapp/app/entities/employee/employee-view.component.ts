import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IEmployee, Employee } from './employee.model';
import { EmployeeService } from './employee.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IRoleType, RoleType } from 'app/entities/role-type/role-type.model';
import { RoleTypeService } from 'app/entities/role-type/role-type.service';
import { IPerson, Person } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IEmploymentType, EmploymentType } from 'app/entities/employment-type/employment-type.model';
import { EmploymentTypeService } from 'app/entities/employment-type/employment-type.service';

type SelectableEntity = IRoleType | IPerson | IInternal | IEmploymentType;

@Component({
  selector: 'jhi-employee-view',
  templateUrl: './employee-view.component.html',
})
export class EmployeeViewComponent extends AbstractEntityBaseViewComponent<IEmployee> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

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
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(employeeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Employee();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Employee();
        this.employeeService.find(this.id).subscribe(result => {
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
    this.roleTypeService.loadCacheAll().subscribe((res: IRoleType[]) => (this.roletypes = res || []));

    this.personService.loadCacheAll().subscribe((res: IPerson[]) => (this.people = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    this.employmentTypeService.loadCacheAll().subscribe((res: IEmploymentType[]) => (this.employmenttypes = res || []));
  }

  prepareView() {}

  get employee() {
    return this.item;
  }

  set employee(employee: IEmployee) {
    this.item = employee;
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
    return this.item.id;
  }
}
