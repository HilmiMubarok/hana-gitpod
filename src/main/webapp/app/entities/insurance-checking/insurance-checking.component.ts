import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { faBullseye, faTimeline } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { IApplicationStateLog } from '../application-state-log/application-state-log.model';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MatTableDataSource } from '@angular/material/table';
import lodash from 'lodash';
import { TemplateService } from 'app/layouts/template/template.service';
import { IInsuranceChecking } from './insurance-checking.model';
import { InsuranceCheckingService } from './insurance-checking.service';
import { CashInsuranceCheckingService } from './cash-insurance-checking.service';

@Component({
  selector: 'jhi-review-insurance',
  templateUrl: './insurance-checking.component.html',
  styleUrls: ['./insurance-checking.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InsuranceCheckingComponent extends AbstractEntityMaterialComponent<IInsuranceChecking> implements OnInit {
  public displayedColumns: string[] = ['no', 'proposalNumber', 'cif', 'customerName', 'customerType', 'createdDate', 'status', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: any;
  public iconTimeline: any;
  public statusCodesData: Object[] = [];
  public statusCodesDataRes: Object[] = [];
  public account: Account;
  public viewButton: boolean;
  public activeRoute: string;
  public positionIdLocStor: string;
  public title: string;
  public value: string;
  public parentPath = this.router.url.split('/')[1];
  public statusSearch = false;
  public positionTypeId: string;
  private monthArray = [
    {
      desc: 'Jan',
      numString: '1',
    },
    {
      desc: 'Feb',
      numString: '2',
    },
    {
      desc: 'Mar',
      numString: '3',
    },
    {
      desc: 'Apr',
      numString: '4',
    },
    {
      desc: 'May',
      numString: '5',
    },
    {
      desc: 'Jun',
      numString: '6',
    },
    {
      desc: 'Jul',
      numString: '7',
    },
    {
      desc: 'Aug',
      numString: '8',
    },
    {
      desc: 'Sep',
      numString: '9',
    },
    {
      desc: 'Oct',
      numString: '10',
    },
    {
      desc: 'Nov',
      numString: '11',
    },
    {
      desc: 'Dec',
      numString: '12',
    },
  ];
  constructor(
    private accountService: AccountService,
    private insuranceCheckingService: InsuranceCheckingService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected applicationConfigService: ApplicationConfigService,
    private cashInsuranceCheckingService: CashInsuranceCheckingService,
    private templateService: TemplateService
  ) {
    super(_snackBar, insuranceCheckingService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      statusId: '',
      statusDescription: '',
    };
    this.iconTimeline = faTimeline;
    this.activeRoute = this.router.url.replace(/\//g, '');
  }

  ngOnInit(): void {
    this.positionIdLocStor = this.getLocStor('POS');

    this.loadAll();
    this.checkLogin();
    this.getPositionTypeId();
  }
  private getPositionTypeId(): void {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.positionTypeId = newPos.positionTypeId;
    });
  }

  public getStatusListView(appMenu: string) {
    this.cashInsuranceCheckingService
      .queryListOfViewStatusFilterBy({
        page: 0,
        size: 9999,
        sort: ['id', 'asc'],
        appMenuId: appMenu,
      })
      .subscribe((res: any) => {
        this.statusCodesData = res.body;
        console.log(this.statusCodesData, 'bisa');
      });
  }

  public doSearch(): void {
    this.page = 0;
    this.itemsPerPage = 10;
    this.statusSearch = true;
    const predicate: object = {
      page: this.page,
      query: this.currentSearch,
      size: this.itemsPerPage,
      sort: this.sortData(),
      idPosition: this.positionIdLocStor,
    };
    predicate['target'] = 'insurance-check';

    this.cashInsuranceCheckingService
      .searchCP(predicate)
      .pipe(map((res: HttpResponse<IInsuranceChecking[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<IInsuranceChecking[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
    return;
  }

  public closeSearch() {
    this.statusSearch = false;
    this.currentSearch = '';
    this.page = 0;

    this.itemsPerPage = 10;
    this.loadAll();
  }

  public chipClick(option: any): void {
    this.page = 0;
    if (this.clickedChip.statusId === option.statusId) {
      this.clickedChip = {
        statusId: '',
        statusDescription: '',
      };
    } else {
      this.clickedChip = option;
    }
    this.loadAll();
  }

  protected postLoadDataLazy(): void {
    if (this.currentSearch === null || this.currentSearch === undefined || this.currentSearch === '') {
      this.loadAll();
    } else {
      this.doSearch();
    }
  }

  private checkReturnStatusDescription(data: IInsuranceChecking[]) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i].statusDescription =
          data[i].statusDescription.substring(0, 2) === 'Ol'
            ? data[i].statusDescription.substring(3, data[i].statusDescription.length)
            : data[i].statusDescription;
      }
    }
    return data;
  }

  private convertStringMonthToNumber(monthString: string) {
    return lodash.find(this.monthArray, function (month) {
      return month.desc === monthString;
    });
  }

  private getStaticDate(date: any) {
    const dateString = date.toString();
    const monthObject = this.convertStringMonthToNumber(dateString.substring(4, 7));
    return dateString.substring(8, 10) + '-' + monthObject.numString + '-' + dateString.substring(11, 15);
  }

  private addStaticDob(data: any) {
    data.forEach(item => {
      if (item.prospectPerson) {
        if (item.prospectPerson.dob) {
          item.prospectPerson.staticDob = this.getStaticDate(item.prospectPerson.dob);
        }
      }
    });
    return data;
  }

  initDataForMatTable(data: any, headers: HttpHeaders) {
    let forCheckedItems = [];

    forCheckedItems = this.addStaticDob(data.body);
    forCheckedItems = this.addIdx(data.body);
    forCheckedItems = this.checkReturnStatusDescription(forCheckedItems);
    console.log('data', forCheckedItems);

    this.items = new MatTableDataSource(forCheckedItems);

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
    if (!this.positionIdLocStor) {
      this.templateService.changePosInt('Empty');
      this.router.navigate(['']);
    } else {
      if (this.router.url === 'insurance-check') {
        this.getStatusListView('INSURANCE_CHECKING');
        if (this.clickedChip['statusId'] !== '') {
          this.cashInsuranceCheckingService
            .InsuranceCheckingBystatus({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
              appMenuId: 'INSURANCE_CHECKING',
            })
            .pipe(map((res: HttpResponse<IInsuranceChecking[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<IInsuranceChecking[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
          return;
        } else {
          this.cashInsuranceCheckingService
            .InsuranceCheckingBystatus({
              page: this.page,
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
              appMenuId: 'INSURANCE_CHECKING',
            })
            .pipe(map((res: HttpResponse<IInsuranceChecking[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<IInsuranceChecking[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else {
        this.getStatusListView('INSURANCE_CHECKING');
        if (this.clickedChip['statusId'] !== '') {
          this.cashInsuranceCheckingService
            .cashCreditProposalApproval({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
              appMenuId: 'INSURANCE_CHECKING',
            })
            .pipe(map((res: HttpResponse<IInsuranceChecking[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<IInsuranceChecking[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
          return;
        } else {
          this.cashInsuranceCheckingService
            .cashCreditProposalApprovalByStatus({
              page: this.page,
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
              appMenuId: 'INSURANCE_CHECKING',
            })
            .pipe(map((res: HttpResponse<IInsuranceChecking[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<IInsuranceChecking[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      }
    }
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.statusCodesData, event.previousIndex, event.currentIndex);
  }

  public previousState(): void {
    window.history.back();
  }

  private convertToTimelineModel(data: IApplicationStateLog[]) {
    const result: ITimeline[] = [];
    if (data.length > 0) {
      let rs: ITimeline;
      for (let i = 0; i < data.length; i++) {
        rs = new Timeline();
        rs.title = data[i].status;
        rs.date = data[i].createdDate;
        rs.text = data[i].note;
        rs.createdBy = data[i].userName;

        result.push(rs);
      }
    }
    return result;
  }

  public showTimeLine(element: IInsuranceChecking): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(res2 => {});
    });
  }

  getText(value: any) {
    if (value === 'insurance-check') {
      this.title = 'INSURANCE_CHECKING ';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'insurance-check') {
      this.title = 'INSURANCE_CHECKING';
      sessionStorage.setItem('appName', this.title);
    }
  }

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
        this.account.authorities['ROLE_RM'] = this.isRm;
      }
    });
  }

  public conditionButtonAddCP() {
    if (this.isRm()) {
      if (this.parentPath === 'cp-status-approval') {
        if (this.account.authorities.length <= 2) {
          this.viewButton = false;
        } else {
          this.viewButton = true;
        }
      }
    }

    if (this.isBm()) {
      if (this.parentPath === 'cp-status-approval') {
        if (this.account.authorities.length <= 2) {
          this.viewButton = true;
        }
      }
    }
    if (this.isSMEHead()) {
      if (this.parentPath === 'cp-status-approval') {
        if (this.account.authorities.length <= 2) {
          this.viewButton = true;
        } else {
          this.viewButton = false;
        }
      }
    }
  }

  public isRm(): any {
    return this.account.authorities.includes('ROLE_RM');
  }
  public isBm(): any {
    return this.account.authorities.includes('ROLE_BM');
  }
  public isSMEHead(): any {
    return this.account.authorities.includes('ROLE_SME_HEAD');
  }
}
