import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { catchError, EMPTY, map, Subject, switchMap, takeUntil } from 'rxjs';
import { IDppkFinalize } from './dppk-finalize.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
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
import { DppkFinalizeProcessService } from './dppk-finalize-process.service';
import { CashDppkFinalizeService } from './cash-dppk-finalize.service';
import { TemplateService } from 'app/layouts/template/template.service';
import { DppkFinalizeService } from './dppk-finalize.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { formatDateDob } from 'app/shared/helper/utils';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { EmployeeService } from '../employee/employee.service';

interface DppkFinalizeData {
  id: number;
  applicationId: number;
  partyId: string;
  partyName: string;
  roleId: string;
  roleDescription: string;
  idPosition: number;
}

interface Position {
  id: number;
  employeeFirstName: string;
  [key: string]: any;
}

interface CreditProposal {
  attributes: {
    [key: string]: string;
  };
  [key: string]: any;
}

@Component({
  selector: 'jhi-dppk-finalize',
  templateUrl: './dppk-finalize.component.html',
  styleUrls: ['./dppk-finalize.css'],
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
export class DppkFinalizeComponent extends AbstractEntityMaterialComponent<IDppkFinalize> implements OnInit, OnDestroy {
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
    private dppkFinalizeService: DppkFinalizeService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected applicationConfigService: ApplicationConfigService,
    private cashDppkFinalizeService: CashDppkFinalizeService,
    private templateService: TemplateService,
    private creditProposalService: CreditProposalService,
    private employeeService: EmployeeService,
  ) {
    super(_snackBar, dppkFinalizeService);
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
    this.cashDppkFinalizeService
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

  // public doSearch(): void {
  //   this.page = 0;
  //   this.itemsPerPage = 10;
  //   this.statusSearch = true;
  //   const predicate: object = {
  //     page: this.page,
  //     query: this.currentSearch,
  //     size: this.itemsPerPage,
  //     sort: this.sortData(),
  //     idPosition: this.positionIdLocStor,
  //   };

  public doSearch(): void {
    this.statusSearch = true;
    const predicate: object = {
      page: this.page,
      query: this.currentSearch,
      size: this.itemsPerPage,
      sort: this.sortData(),
      idPosition: this.positionIdLocStor,
    };
    predicate['target'] = 'finalize-dppk';

    this.cashDppkFinalizeService
      .searchCP(predicate)
      .pipe(map((res: HttpResponse<IDppkFinalize[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<IDppkFinalize[]>) => {
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

  private checkReturnStatusDescription(data: IDppkFinalize[]) {
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
          item.prospectPerson.staticDob = formatDateDob(item.prospectPerson.dob);
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
      if (this.router.url === '/finalize-dppk') {
        this.getStatusListView('FINALIZE_DPPK');
        if (this.clickedChip['statusId'] !== '') {
          this.cashDppkFinalizeService
            .finalizeDppkBystatus({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
            })
            .pipe(map((res: HttpResponse<IDppkFinalize[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<IDppkFinalize[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
          return;
        } else {
          this.cashDppkFinalizeService
            .finalizeDppkBystatus({
              page: this.page,
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
            })
            .pipe(map((res: HttpResponse<IDppkFinalize[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<IDppkFinalize[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else {
        this.getStatusListView('FINALIZE_CREDIT_AGREEMENT');
        if (this.clickedChip['statusId'] !== '') {
          this.cashDppkFinalizeService
            .cashCreditProposalApproval({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
            })
            .pipe(map((res: HttpResponse<IDppkFinalize[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<IDppkFinalize[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
          return;
        } else {
          this.cashDppkFinalizeService
            .cashCreditProposalApproval({
              page: this.page,
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
            })
            .pipe(map((res: HttpResponse<IDppkFinalize[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<IDppkFinalize[]>) => this.initDataForMatTable(res, res.headers),
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
        rs.title = data[i].statusDescription;
        rs.date = data[i].createdDate;
        rs.text = data[i].note;
        rs.createdBy = data[i].userName;

        result.push(rs);
      }
    }
    return result;
  }

  public showTimeLine(element: IDppkFinalize): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(res2 => { });
    });
  }

  getText(value: any) {
    if (value === 'finalize-dppk') {
      this.title = 'DPPK Finalize ';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'finalize-dppk') {
      this.title = 'DPPK Finalize  ';
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
  public openCancelDialog(id, element): void {
    if (element.listOfPic.length > 1 && element.statusDescription === 'DPPK Finalize') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '25vw',
        data: {
          title: '',
          message: 'Sure To Execute Data?',
        },
        panelClass: 'custom-dialog-container-cancel',
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.dppkFinalizeService.getRoleActive(id, this.positionIdLocStor, this.getLocStor('POSO')).subscribe(() => {
            this._saveAttributeAndRedirect(id)
          });
        }
      });
    } else {
      this.router.navigate(['/' + this.parentPath + '/' + id + '/' + 'edit']);
    }
  }

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _saveAttributeAndRedirect(id: number): void {
    const dataAssignDppkFinalize: DppkFinalizeData = {
      id: Number(this.positionIdLocStor),
      applicationId: id,
      partyId: this.getLocStor('POSOPARID'),
      partyName: '',
      roleId: this.getLocStor('POSO'),
      roleDescription: this.getLocStor('POSOD'),
      idPosition: Number(this.positionIdLocStor)
    };

    this.creditProposalService.find(id).pipe(
      map(response => response.body as CreditProposal),
      switchMap(cp => this.accountService.identity().pipe(
        map(account => ({ cp, account }))
      )),
      switchMap(({ cp, account }) => {
        if (!account) {
          throw new Error('Account not found');
        }

        return this.employeeService.queryFilterBy({
          page: 0,
          query: 999,
          sort: ['id,desc'],
          eqLogin: account.login
        }).pipe(
          map(employee => ({
            cp,
            positions: (employee.body[0] as any).positions as Position[]
          }))
        );
      }),
      map(({ cp, positions }) => {
        const partyName = this._findPartyName(positions);
        dataAssignDppkFinalize.partyName = partyName;

        cp.attributes['dataAssignDppkFinalize'] = JSON.stringify(dataAssignDppkFinalize);
        return cp;
      }),
      // Update save CP
      switchMap(cp => this.dppkFinalizeService.update(cp)),
      catchError(error => {
        console.error('Error in save and redirect process:', error);
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: result => this.router.navigate(['/' + this.parentPath + '/' + id + '/' + 'edit']),
      error: error => console.error('Unexpected error:', error)
    });
  }

  private _findPartyName(positions: Position[]): string {
    const filteredPosition = positions.find(pos => pos.id === Number(this.positionIdLocStor));
    if (!filteredPosition) {
      throw new Error('Position not found');
    }
    return filteredPosition.employeeFirstName;
  }

}