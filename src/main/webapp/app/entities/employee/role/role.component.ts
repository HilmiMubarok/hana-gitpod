import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { ApplicationStateLogService } from 'app/entities/application-state-log/application-state-log.service';
import { EMPLOYEE } from 'app/shared/constants/base.constants';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'jhi-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.css'],
})
export class RoleComponent extends AbstractEntityMaterialComponent<IEmployee> implements OnInit {
  public displayedColumns: string[] = ['no', 'userLogin', 'name', 'nik', 'lastModifiedDate', 'statusDescription', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: Object;
  public iconTimeline: any;

  public subMenu: object[];
  globalSearchValModel: any;
  currentSearch: any;
  filterData: {
    id: string;
    description: string;
  }[];

  constructor(
    private employeeService: EmployeeService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected reportUtils: ReportUtilService
  ) {
    super(_snackBar, employeeService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      id: '',
      label: '',
    };
    this.iconTimeline = faTimeline;
  }

  ngOnInit(): void {
    this.subMenu = EMPLOYEE;
    this.loadAll();
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public doChange(e) {
    if (e.value === '') {
      this.currentSearch = '';
    }
  }

  public doSearch(args: any): void {
    if (this.currentSearch) {
      this.router.navigate(['employee/role'], { queryParams: { search: this.currentSearch } });
      this.loadAll();
    } else {
      this.router.navigate(['employee/role']);
      this.loadAll();
    }
  }

  private removeAdmin(data: any) {
    let indexAdmin = 0;

    if (data.length > 0 && data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]['id'] === 1) {
          indexAdmin = i;
          data.splice(indexAdmin, 1);
        }
      }
    }

    return data;
  }

  initDataForMatTable(data: any, headers: HttpHeaders) {
    // this.items = this.removeAdmin(data.body);
    this.items = new MatTableDataSource(this.addIdx(data.body));
    if (!this.items) {
      this.items.paginator = this.paginator;
    }
    this.items.sort = this.sort;
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
    this.loading = false;
  }

  private loadAll(): void {
    this.loading = true;
    this.filterData = [
      {
        id: 'Fname',
        description: 'First Name',
      },
      {
        id: 'Lname',
        description: 'Last Name',
      },
      {
        id: 'internalName',
        description: 'Nama Branch',
      },
      {
        id: 'email',
        description: 'Email',
      },
      {
        id: 'login',
        description: 'Login',
      },
    ];
    let flagSrc;
    if (this.currentSearch && this.globalSearchValModel) {
      if (this.globalSearchValModel === 'Fname' || this.globalSearchValModel === 'Lname') {
        flagSrc = 'name';
      } else {
        flagSrc = this.globalSearchValModel;
      }
      const obj = {
        page: 0,
        query: 10,
        sort: ['id,desc'],
        [flagSrc]: this.currentSearch,
      };
      this.employeeService.queryFilterBy(obj).subscribe({
        next: (res: HttpResponse<IEmployee[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
      return;
    }

    this.employeeService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'asc'],
      })
      .subscribe({
        next: (res: HttpResponse<IEmployee[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }

  public routeSubMenu(menu: object): void {
    this.router.navigate(['./employee/' + menu['id']]);
  }
}
