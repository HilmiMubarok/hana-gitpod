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
import { MatDialog } from '@angular/material/dialog';
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
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { Router } from '@angular/router';
import { DELEGATION } from 'app/shared/constants/base.constants';
type SelectableEntity = IRoleType | IPerson | IInternal | IEmploymentType;

@Component({
  selector: 'jhi-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee.css'],
})
export class EmployeeUpdateComponent extends AbstractEntityUpdateComponent<IEmployee> {
  public label: IEmployeeStrapi;
  public button: IButton;
  public subMenu: any;

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
    private dialog: MatDialog,
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
    private strapiService: StrapiService,
    public router: Router
  ) {
    super(dataUtils, employeeService, elementRef, confirmationService, toastService, activatedRoute);
    this.label = new EmployeeStrapi();
    this.listChangeEventName = 'employeeListModification';
  }

  protected initialState(): any {
    return { item: new Employee(), tasks: [], id: undefined };
  }

  initialize() {
    this.subMenu = DELEGATION;
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
    const tmpBranch = [];
    this.internalService
      .query({
        page: 0,
        size: 999,
      })
      .subscribe(response => {
        for (let a = 0; a < response.body.length; a++) {
          if (response.body[a].internalTypeId === 'BRANCH') {
            tmpBranch.push(response.body[a]);
          }
        }
        this.branchtype = tmpBranch;

        if (this.activatedRoute.snapshot.paramMap.get('id')) {
          this.labelStr = 'Update Employee';
          this.id = this.activatedRoute.snapshot.paramMap.get('id');
          this.employeeService.find(this.id).subscribe(res => {
            if (new Date(res.body.thruDate).getFullYear() !== 9999) {
              this.thruDateTMP = res.body.thruDate;
            }

            const filtered = this.branchtype.filter(function (item) {
              return item.id === res.body.internalId;
            });
            if (filtered.length > 0) {
              this.choosedBranch(filtered[0]);
            }
          });
        } else {
          this.labelStr = 'Add New Employee';
        }
      });
  }
  public routeSubMenu(menu: object): void {
    this.router.navigate(['./employee/' + this.activatedRoute.snapshot.paramMap.get('id') + '/' + menu['id']]);
  }
  choosedBranch(data) {
    if (data.parentId !== null) {
      this.getSegment(data.parentId);
    } else {
      this.segmentModel = '';
    }
  }

  getSegment(parentId) {
    if (parentId === null) {
      this.segmentModel = '';
    } else {
      this.internalService.find(parentId).subscribe(res => {
        const arr = [];
        arr.push(res.body);
        for (let a = 0; a < arr.length; a++) {
          if (arr[a].parentId !== '10000') {
            this.getSegment(res.body.parentId);
          } else {
            this.segmentModel = arr[a].facilityName;
          }
        }
      });
    }
  }

  submit() {
    this.item.thruDate = this.thruDateTMP;
    this.save();
  }

  get employee() {
    return this.item;
  }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.previousState();
      }
    });
  }
}
