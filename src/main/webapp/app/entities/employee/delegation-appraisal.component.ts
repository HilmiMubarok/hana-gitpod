import { Component, OnChanges, SimpleChanges, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { DialogDelegationAppraisalComponent } from './dialog-delegation/dialog-delegation-appraisal.component';
import { MatDialog } from '@angular/material/dialog';
import { CashSurveyAppraisalsService } from '../survey-appraisals/cash-survey-appraisal.service';
import { HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'jhi-delegation-appraisal',
  templateUrl: './delegation-appraisal.component.html',
  styleUrls: ['./employee.css'],
})
export class DelegationAppraisalComponent extends AbstractEntityBaseViewComponent<IEmployee> implements OnInit {
  public items: any[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() id: number;
  public paginatorPageSizeOption: number[] = [10, 20, 30];
  readonly CODE: typeof CODE = CODE;
  public displayedColumns: string[] = ['no', 'delegationFrom', 'delegationTo', 'dateFrom', 'dateTru', 'reason'];
  public paginatorLength: number;
  public paginatorPageSize: number;
  roletypes: IRoleType[] = [];

  people: IPerson[] = [];

  internals: IInternal[] = [];

  employmenttypes: IEmploymentType[] = [];
  roleId: string;
  personId: string;
  internalId: string;
  employmentTypeId: string;
  public partyId: string;
  public fromEmployee: IEmployee;
  public itemsPerPage: number;
  public page: number;
  public data: any;

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
    public account: AccountService,
    public dialog: MatDialog,
    public cashSurveyAppraisalsService: CashSurveyAppraisalsService
  ) {
    super(employeeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Employee();
    this.itemsPerPage = 10;
    this.page = 0;
  }

  public previousState(): void {
    window.history.back();
  }

  public loadDataLazy(event: any): void {
    this.loadAll();
  }

  ngOnInit(): void {
    this.employeeService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
      this.partyId = res.body.partyId;
      this.fromEmployee = res.body;

      this.loadAll();
    });
  }

  public loadAll() {
    this.cashSurveyAppraisalsService
      .queryDelegationAppraisalFilterBy({
        page: this.page,
        sort: ['ASC'],
        size: this.itemsPerPage,
        fromPartyId: this.partyId,
      })
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }

  initDataForMatTable(data: any, headers: HttpHeaders) {
    this.data = new MatTableDataSource(this.addIdx(data.body));
    if (!this.items) {
      this.data.paginator = this.paginator;
    }
    this.data.sort = this.sort;
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
  }

  addIdx(data: Object[]) {
    if (data.length > 0 && data) {
      for (let i = 0; i < data.length; i++) {
        data[i]['idx'] = i;
      }
    }

    return data;
  }

  public openDialog(): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['partyId'] = this.partyId;
    predicate.data['fromEmployee'] = this.fromEmployee;

    const dialogRef = this.dialog.open(DialogDelegationAppraisalComponent, predicate);
    dialogRef.afterClosed().subscribe((r: any) => {
      this.loadAll();
    });
  }
}
