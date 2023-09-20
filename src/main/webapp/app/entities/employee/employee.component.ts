import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { EmployeeDownload, IEmployee } from './employee.model';
import { EmployeeService } from './employee.service';
import { ApplicationStateLogService } from 'app/entities/application-state-log/application-state-log.service';
import { EMPLOYEE } from 'app/shared/constants/base.constants';
import { MatTableDataSource } from '@angular/material/table';
import { DownloadProgressComponent } from 'app/miscellaneous/download-progress.component';
import FileSaver from 'file-saver';
import lodash from 'lodash';
import { EmployeeUploadComponent } from './employee-upload.component';

export interface IEmployeeDownload {
  id?: number;
  partyId?: string;
  internalId?: string;
  userId?: string;
  personalEmail?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
}

@Component({
  selector: 'jhi-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.css'],
})
export class EmployeeComponent extends AbstractEntityMaterialComponent<IEmployee> implements OnInit {
  public displayedColumns: string[] = ['no', 'userLogin', 'name', 'nik', 'lastModifiedDate', 'statusDescription', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: Object;
  public iconTimeline: any;
  public isOpen = false;

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
      this.router.navigate(['employee'], {
        queryParams: {
          search: this.currentSearch,
        },
      });
      this.loadAll();
    } else {
      this.router.navigate(['employee']);
      this.loadAll();
    }
  }

  public upload(): void {
    const dialogRef: any = this.dialog.open(EmployeeUploadComponent, {
      width: '1024px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadAll();
    });
  }

  public getTemplate(): void {
    import('xlsx').then(xlsx => {
      const newData: IEmployeeDownload = new EmployeeDownload();
      delete newData['id'];
      delete newData['partyId'];

      const worksheet = xlsx.utils.json_to_sheet([newData]); // Sale Data
      const workbook = {
        Sheets: {
          data: worksheet,
        },
        SheetNames: ['data'],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const result: Blob = new Blob([excelBuffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(result, 'template_upload_employee' + EXCEL_EXTENSION);
    });
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

  public async download(): Promise<void> {
    const dialogRef: any = this.dialog.open(DownloadProgressComponent, {
      width: '300px',
    });
    const listForLoad: IEmployee[] = (
      await firstValueFrom(
        this.employeeService.query({
          page: 0,
          size: 1,
        })
      )
    ).body;
    if (listForLoad.length > 0) {
      const listForDownload: IEmployeeDownload[] = lodash.map(listForLoad, function (o) {
        const newData: IEmployeeDownload = {};
        newData.id = o.id;
        newData.personalEmail = o.person.personalEmail;
        newData.internalId = o.internalId;
        newData.partyId = o.person.id;
        newData.status = o.statusId;
        newData.userId = o.person.userLogin;

        return newData;
      });
      // await new Promise(f => setTimeout(f, 4000));
      import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(listForDownload); // Sale Data
        const workbook = {
          Sheets: {
            data: worksheet,
          },
          SheetNames: ['data'],
        };
        const excelBuffer: any = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });

        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const result: Blob = new Blob([excelBuffer], {
          type: EXCEL_TYPE,
        });
        FileSaver.saveAs(result, 'employee_export_' + new Date().getTime() + EXCEL_EXTENSION);

        dialogRef.close();
      });
    }
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
  public triggerToggle() {
    this.isOpen = !this.isOpen;
  }
}
