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
import { DialogDelegationApplicationComponent } from './dialog-delegation/dialog-delegation-application.component';
import { MatDialog } from '@angular/material/dialog';
import { CashCreditProposalService } from 'app/entities/credit-proposal/cash-credit-proposal.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
type SelectableEntity = IRoleType | IPerson | IInternal | IEmploymentType;

@Component({
  selector: 'jhi-delegation-application',
  templateUrl: './delegation-application.component.html',
  styleUrls: ['./employee.css'],
})
export class DelegationApplicationComponent extends AbstractEntityBaseViewComponent<IEmployee> implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public paginatorPageSizeOption: number[] = [10, 20, 30];
  public items: any[];
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;
  public displayedColumns: string[] = ['no', 'delegationFrom', 'delegationTo', 'dateFrom', 'dateTru', 'reason'];

  roletypes: IRoleType[] = [];

  people: IPerson[] = [];

  internals: IInternal[] = [];
  public paginatorLength: number;
  public paginatorPageSize: number;
  public data: any;

  employmenttypes: IEmploymentType[] = [];
  roleId: string;
  personId: string;
  internalId: string;
  employmentTypeId: string;
  public partyId: string;
  public fromEmployee: IEmployee;
  public itemsPerPage: number;
  public page: number;

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
    public cashCreditProposalService: CashCreditProposalService
  ) {
    super(employeeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Employee();
    this.itemsPerPage = 10;
    this.page = 0;
  }

  ngOnInit(): void {
    this.employeeService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: any) => {
      this.partyId = res.body.partyId;
      this.fromEmployee = res.body;
      this.loadAll();
    });
  }
  public previousState(): void {
    window.history.back();
  }

  public loadDataLazy(event: any): void {
    this.loadAll();
  }

  public loadAll() {
    this.cashCreditProposalService
      .queryDelegationApplicationFilterBy({
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

    const dialogRef = this.dialog.open(DialogDelegationApplicationComponent, predicate);
    dialogRef.afterClosed().subscribe((r: any) => {
      this.loadAll();
    });
  }
}
