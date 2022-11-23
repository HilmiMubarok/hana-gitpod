import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// import { IPartner } from './partner.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
// import { PartnerService } from './partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
// import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { InternalService } from './internal.service';
// import { IInternal } from './internal.model';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { IEmployee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { ApplicationStateLogService } from 'app/entities/application-state-log/application-state-log.service';
import { EMPLOYEE } from 'app/shared/constants/base.constants';

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
  // constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

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
    // this.activatedRoute.data.subscribe(({ partner }) => (this.partner = partner));
    this.loadAll();
    // console.log("hahah");
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    console.log('this role');
    this.employeeService
      // .query({
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'asc'],
      })
      .subscribe({
        next: (res: HttpResponse<IEmployee[]>) => {
          console.log('res', res);
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }

  public routeSubMenu(menu: object): void {
    // this.router.navigate([this.router.url], { queryParams: { subroute: menu['id'] } });
    this.router.navigate(['./employee/' + menu['id']]);
  }
}
