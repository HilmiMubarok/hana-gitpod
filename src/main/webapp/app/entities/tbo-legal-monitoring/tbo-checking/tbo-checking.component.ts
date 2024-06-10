import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { DocumentTBO, ITboCheckingModel } from './tbo-checking.model';
import { TboCheckingService } from './tbo-checking.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { ApplicationStateLogService } from 'app/entities/application-state-log/application-state-log.service';
import { IApplicationStateLog } from 'app/entities/application-state-log/application-state-log.model';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MatTableDataSource } from '@angular/material/table';
import lodash from 'lodash';
import { CashTboLegalMonitoringService } from '../cash-tbo-legal-monitoring.service';
import { TemplateService } from 'app/layouts/template/template.service';
import { writeFile, utils } from 'xlsx';

@Component({
  selector: 'jhi-tbo-checking',
  templateUrl: './tbo-checking.component.html',
  styleUrls: ['./tbo-checking.style.css'],
  styles: [
    `
      #generate-btn {
        position: relative;
        transition: background-color 0.3s ease;
        overflow: hidden;
      }

      #generate-btn.loading {
        pointer-events: none;
        color: transparent;
      }

      #generate-btn.loading::after {
        content: 'Generating...';
        color: #fff;
        font-family: 'Poppins', sans-serif;
        position: absolute;
        font-weight: bold;
        top: 0;
        left: 0;
        width: 100%;
        min-width: 64px;
        line-height: 36px;
        padding: 0 16px;
        border-radius: 4px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 1;
      }

      @keyframes loading-animation {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }

      #generate-btn.loading::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, rgb(255 255 255) 0%, rgb(255 255 255) 50%, rgb(147 201 198 / 0%) 100%);
        animation: loading-animation 1s linear infinite;
        z-index: 0;
      }
    `,
  ],
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
export class TboCheckingComponent extends AbstractEntityMaterialComponent<ITboCheckingModel> implements OnInit {
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
    private tboCheckingService: TboCheckingService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected applicationConfigService: ApplicationConfigService,
    private cashTboLegalMonitoringService: CashTboLegalMonitoringService,
    private templateService: TemplateService
  ) {
    super(_snackBar, tboCheckingService);
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

  public generateDocumentLabel = 'Generate Document';
  public loadingGenerateDocument = false;

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
    this.cashTboLegalMonitoringService
      .queryListOfViewStatusFilterBy({
        page: 0,
        size: 9999,
        sort: ['id', 'asc'],
        appMenuId: appMenu,
      })
      .subscribe((res: any) => {
        this.statusCodesData = res.body;
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

    if (this.activeRoute === 'credit-proposal-status') {
      predicate['target'] = 'credit_proposal_status';
    } else if (this.activeRoute === 'cp-status-approval') {
      predicate['target'] = 'credit_proposal_approval';
    } else if (this.activeRoute === 'dar-revision') {
      predicate['target'] = 'dar_revision';
    }

    this.cashTboLegalMonitoringService
      .searchCP(predicate)
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<ITboCheckingModel[]>) => {
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

  private checkReturnStatusDescription(data: ITboCheckingModel[]) {
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
      if (this.router.url === '/tbo-legal-checking') {
        this.getStatusListView('TBO_LEGAL_CHECKING');
        if (this.clickedChip['statusId'] !== '') {
          this.cashTboLegalMonitoringService
            .getTboLegalMonitoring({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
              appMenuId: 'TBO_LEGAL_CHECKING',
            })
            .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ITboCheckingModel[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
          return;
        } else {
          this.cashTboLegalMonitoringService
            .getTboLegalMonitoring({
              page: this.page,
              idPosition: this.positionIdLocStor,
              size: this.itemsPerPage,
              sort: ['id,desc'],
              appMenuId: 'TBO_LEGAL_CHECKING',
            })
            .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ITboCheckingModel[]>) => this.initDataForMatTable(res, res.headers),
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

  public showTimeLine(element: ITboCheckingModel): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(res2 => {});
    });
  }

  getText(value: any) {
    if (value === 'tbo-legal-checking') {
      this.title = 'TBO LEGAL MONITORING';
      sessionStorage.setItem('appName', this.title);
    }
    // if (value === 'credit-proposal-status') {
    //   this.title = 'Credit Proposal';
    //   sessionStorage.setItem('appName', this.title);
    // }
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
      if (this.parentPath === 'dar-revision') {
        if (this.account.authorities.length <= 2) {
          this.viewButton = false;
        } else {
          this.viewButton = true;
        }
      }
    }

    if (this.isBm()) {
      if (this.parentPath === 'dar-revision') {
        if (this.account.authorities.length <= 2) {
          this.viewButton = true;
        }
      }
    }
    if (this.isSMEHead()) {
      if (this.parentPath === 'dar-revision') {
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

  public generateDocumentTBO() {
    this.loadingGenerateDocument = true;
    this.generateDocumentLabel = 'Generating...';

    const date = new Date();
    const fileName = `TBO_Legal_Monitoring_${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}.xlsx`;

    this.tboCheckingService.generateDocument().subscribe({
      next(res: HttpResponse<any>) {
        const template_report_data = [
          { key: 'Proposal Number', valueFrom: 'applicationNumber', format: 'string' },
          { key: 'Debtors Name', valueFrom: 'debtorName', format: 'string' },
          { key: 'Branch', valueFrom: 'branch', format: 'string' },
          { key: 'RM', valueFrom: 'rm', format: 'string' },
          { key: 'PIC', valueFrom: 'pic', format: 'string' },
          { key: 'Document Name', valueFrom: 'name', format: 'string' },
          { key: 'Current Document Status', valueFrom: 'initialStatusId', format: 'string' },
          { key: 'Current Document Date', valueFrom: 'date', format: 'date' },
          { key: 'Proposed Document Status', valueFrom: 'statusAppDocId', format: 'string' },
          { key: 'Proposed Document Date', valueFrom: 'dueDate', format: 'date' },
          { key: 'Monitoring Checking Date', valueFrom: 'checkingDate', format: 'date' },
          { key: 'Monitoring Review Date', valueFrom: 'reviewDate', format: 'date' },
          { key: 'Monitoring Approval Date', valueFrom: 'approvalDate', format: 'date' },
          { key: 'Remark', valueFrom: 'notes', format: 'string' },
        ];

        const data = [];
        res.body.forEach(item => {
          const row = {};
          template_report_data.forEach(template => {
            row['No'] = data.length + 1;

            if (template['format'] === 'date') {
              if (item[template.valueFrom] === null) {
                row[template.key] = '';
                return;
              }

              const dateValue = new Date(item[template.valueFrom]);

              // Format to dd/mm/yyyy
              row[template.key] = `${dateValue.getDate()}/${dateValue.getMonth() + 1}/${dateValue.getFullYear()}`;
            }

            if (template['format'] === 'string') {
              row[template.key] = item[template.valueFrom] === null ? '' : item[template.valueFrom];
            }

            row['Status Last Meeting'] = '';
          });
          data.push(row);
        });

        console.log('Final Data', data);

        const ws = utils.json_to_sheet(data);

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Data');

        writeFile(wb, fileName);
      },
      error(err: any) {
        console.log(err);
      },
      complete: () => {
        this.loadingGenerateDocument = false;
        this.generateDocumentLabel = 'Generate Document';
      },
    });
  }
}
