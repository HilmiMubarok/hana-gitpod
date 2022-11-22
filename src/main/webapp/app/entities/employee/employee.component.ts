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
import { IEmployee } from './employee.model';
import { EmployeeService } from './employee.service';
import { ApplicationStateLogService } from 'app/entities/application-state-log/application-state-log.service';
import { EMPLOYEE } from 'app/shared/constants/base.constants';

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

// import { Component, ViewChild, ElementRef } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AccountService } from 'app/core/auth/account.service';
// import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
// import { IEmployee } from './employee.model';
// import { EmployeeService } from './employee.service';
// import { IEmployee as IEmployeeStrapi, Employee as EmployeeStrapi } from '../../shared/integration/models/employees-page.model';
// import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
// import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { saveAs } from 'file-saver';
// import { ReportUtilService } from 'app/shared/base/report-util.service';
// import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
// import { ParseLinks } from 'app/core/util/parse-links.service';
// import { AlertService } from 'app/core/util/alert.service';
// import { EventManager } from 'app/core/util/event-manager.service';
// import { StrapiService } from 'app/shared/integration/strapi.service';
// import { HttpResponse } from '@angular/common/http';
// import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
// import { Button, IButton } from 'app/shared/integration/models/button.model';
// import { EMPLOYEE } from 'app/shared/constants/base.constants';

// @Component({
//   selector: 'jhi-employee',
//   templateUrl: './employee.component.html',
//   styleUrls: ['./employee.css'],
// })
// export class EmployeeComponent extends AbstractEntityEj2GridComponent<IEmployee> {
//   @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

//   public label: IEmployeeStrapi;
//   public button: IButton;
//   public subMenu: object[];

//   constructor(
//     protected employeeService: EmployeeService,
//     protected parseLinks: ParseLinks,
//     protected alertService: AlertService,
//     public accountService: AccountService,
//     protected activatedRoute: ActivatedRoute,
//     protected dataUtils: BaseDataUtils,
//     protected router: Router,
//     protected eventManager: EventManager,
//     protected messageService: MessageService,
//     protected modalService: NgbModal,
//     protected confirmationService: ConfirmationService,
//     protected reportUtils: ReportUtilService,
//     private strapiService: StrapiService
//   ) {
//     super(
//       employeeService,
//       parseLinks,
//       accountService,
//       activatedRoute,
//       dataUtils,
//       router,
//       eventManager,
//       messageService,
//       confirmationService
//     );

//     this.label = new EmployeeStrapi();
//     this.button = new Button();

//     this.parentRoute = '/employee';
//     this.listChangeEventName = 'employeeListModification';
//     this.entityKeyName = 'id';

//     this.routeData = this.activatedRoute.data.subscribe(data => {
//       this.page = data.pagingParams.page;
//       this.previousPage = data.pagingParams.page;
//       this.reverse = data.pagingParams.ascending;
//       this.predicate = data.pagingParams.predicate;
//       activatedRoute.queryParams.subscribe(params => {
//         this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
//         this.first = (this.page - 1) * this.itemsPerPage || 0;
//       });
//     });
//     this.currentSearch =
//       this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
//   }

//   protected initialize(): void {
//     this.subMenu = EMPLOYEE;

//     this.strapiService.getEmployees({ pageAt: 'index' }).subscribe((res: HttpResponse<IEmployeeStrapi[]>) => {
//       if (res.body.length > 0) {
//         this.label = res.body[0];
//       }
//     });

//     this.strapiService.getButton().subscribe((res: HttpResponse<IButton>) => {
//       if (res.body) {
//         this.button = res.body;
//       }
//     });
//   }

//   trackId(index: number, item: IEmployee) {
//     return item.id;
//   }

//   previousState(): void {
//     window.history.back();
//   }

//   public routeSubMenu(menu: object): void {
//     // this.router.navigate([this.router.url], { queryParams: { subroute: menu['id'] } });
//     this.router.navigate(['./employee/' + menu['id']]);
//   }
// }
