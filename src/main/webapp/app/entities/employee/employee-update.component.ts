import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IEmployee, Employee } from './employee.model';
import { IEmployee as IEmployeeStrapi, Employee as EmployeeStrapi } from '../../shared/integration/models/employees-page.model';
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
import { StrapiService } from 'app/shared/integration/strapi.service';
import { IButton } from 'app/shared/integration/models/button.model';

type SelectableEntity = IRoleType | IPerson | IInternal | IEmploymentType;

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee.css'],
})
export class EmployeeUpdateComponent extends AbstractEntityUpdateComponent<IEmployee> {
  public label: IEmployeeStrapi;
  public button: IButton;

  roletypes: IRoleType[] = [];

  people: IPerson[] = [];

  internals: IInternal[] = [];

  employmenttypes: IEmploymentType[] = [];
  roleId: string;
  personId: string;
  internalId: string;
  employmentTypeId: string;
  thruDateTMP?: Date;
  segmentModel?: string;
  branchtype: any;
  desc: {
    id: string;
    description: string;
  }[];
  id: string;
  labelStr: string;
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
    protected reportUtils: ReportUtilService,
    private strapiService: StrapiService
  ) {
    super(dataUtils, employeeService, elementRef, confirmationService, toastService, activatedRoute);
    this.label = new EmployeeStrapi();
    this.listChangeEventName = 'employeeListModification';
  }

  protected initialState(): any {
    // this.item.thruDate = "";
    return { item: new Employee(), tasks: [], id: undefined };
  }

  initialize() {
    console.log('initial nih', this.item);
    // this.thruDateTMP = this.item.thruDate;
    this.desc = [
      {
        id: 'ACTIVE',
        description: 'Active',
      },
      {
        id: 'NON_ACTIVE',
        description: 'Non Active',
      },
    ];
    this.internalService
      .query({
        page: 0,
        size: 999,
      })
      .subscribe(response => {
        this.branchtype = response.body;

        if (this.activatedRoute.snapshot.paramMap.get('id')) {
          console.log('masuk edit');
          this.labelStr = 'Update Employee';
          this.id = this.activatedRoute.snapshot.paramMap.get('id');
          this.employeeService.find(this.id).subscribe(res => {
            console.log('response detail', res.body);
            // console.log("new Date",new Date("9999-12-31T00:00:00+07:00").getFullYear());
            if (new Date(res.body.thruDate).getFullYear() !== 9999) {
              this.thruDateTMP = res.body.thruDate;
            }
            const filtered = this.branchtype.filter(function (item) {
              return item.id === res.body.internalId;
            });
            console.log('filtered', filtered);
            this.choosedBranch(filtered[0]);
          });
        } else {
          this.labelStr = 'Add New Employee';
        }
      });
    // this.strapiService.getEmployees({ pageAt: 'edit' }).subscribe((res: HttpResponse<IEmployeeStrapi[]>) => {
    //   if (res.body.length > 0) {
    //     this.label = res.body[0];
    //   }
    // });

    // this.strapiService.getButton().subscribe((res: HttpResponse<IButton>) => {
    //   this.button = res.body;
    // });

    // combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
    //   this.currentAccount = account_;

    //   // Read Route Parameter
    //   if (params['roleId']) {
    //     this.roleId = params['roleId'];
    //   }
    //   if (params['personId']) {
    //     this.personId = params['personId'];
    //   }
    //   if (params['internalId']) {
    //     this.internalId = params['internalId'];
    //   }
    //   if (params['employmentTypeId']) {
    //     this.employmentTypeId = params['employmentTypeId'];
    //   }
    // });

    // this.roleTypeService.loadCacheAll().subscribe((res: IRoleType[]) => (this.roletypes = res || []));

    // this.personService.loadCacheAll().subscribe((res: IPerson[]) => (this.people = res || []));

    // this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    // this.employmentTypeService.loadCacheAll().subscribe((res: IEmploymentType[]) => (this.employmenttypes = res || []));
  }

  choosedBranch(data) {
    console.log('data branch', data);
    if (data.parentId !== null) {
      this.getSegment(data.parentId);
    } else {
      this.segmentModel = '';
    }
  }

  getSegment(parentId) {
    console.log('parentId', parentId);
    if (parentId === null) {
      this.segmentModel = '';
    } else {
      this.internalService.find(parentId).subscribe(res => {
        console.log('res parent', res);
        const arr = [];
        arr.push(res.body);
        console.log('arr', arr);
        for (let a = 0; a < arr.length; a++) {
          if (arr[a].parentId !== '10000') {
            this.getSegment(arr[a].parentId);
          } else {
            console.log('stop sudah dapat', arr[a]);
            this.segmentModel = arr[a].parentName;
          }
        }
      });
    }
  }

  submit() {
    this.item.thruDate = this.thruDateTMP;
    console.log('this.item final', this.item);
    this.save();
  }

  // protected loadRelatedEntityEffect(state: any): Observable<any> {
  //   const result = of(state);
  //   return result;
  // }

  // protected buildDependencyEffect(state: any): Observable<any> {
  //   return of(state);
  // }

  // protected prepareSaveEffect(state: any): Observable<any> {
  //   return of(state);
  // }

  // trackRoleTypeById(index: number, item: IRoleType) {
  //   return item.id;
  // }

  // trackPersonById(index: number, item: IPerson) {
  //   return item.id;
  // }

  // trackInternalById(index: number, item: IInternal) {
  //   return item.id;
  // }

  // trackEmploymentTypeById(index: number, item: IEmploymentType) {
  //   return item.id;
  // }

  // itemKey() {
  //   return this.stateSubject.getValue().item.id;
  // }

  get employee() {
    return this.item;
  }

  // print() {
  //   this.reportUtils.viewFile('/api/report/Employee/pdf', {});
  //   return false;
  // }
}
