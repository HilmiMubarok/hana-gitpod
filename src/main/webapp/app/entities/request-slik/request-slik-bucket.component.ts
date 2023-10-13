import { Component, OnInit, ViewChild } from '@angular/core';
import { IRequestSlik } from './request-slik.model';
import { switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { IInternal } from '../internal/internal.model';
import { InternalService } from '../internal/internal.service';
import { MessageService } from 'primeng/api';
import { MatSort } from '@angular/material/sort';
import { RequestSlikStatusService } from './services/request-slik-status.service';
import _ from 'lodash';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { RequestSlikTimelineService } from './services/request-slik-timeline.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RequestSlikBucketService } from './services/request-slik-bucket.service';
import { AccountService } from 'app/core/auth/account.service';
import { EmployeeService } from '../employee/employee.service';

@Component({
  selector: 'jhi-request-slik-bucket',
  templateUrl: './request-slik-bucket.component.html',
  styleUrls: ['../party-cif/party-cif.style.scss'],
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
export class RequestSlikBucketComponent implements OnInit {
  isLoading: Boolean = true;
  displayedColumns: string[] = ['id', 'requestNumber', 'cif', 'debtorName', 'customerType', 'segment', 'requestDate', 'status', 'action'];
  displayedColumnsExpand: string[] = [...this.displayedColumns, 'expand'];
  public displayedColumnsDetail: string[] = ['no'];
  public expandedElement;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  iconTimeline: any;
  isBusinessSupport: boolean;
  isHasAddSlikPermission: boolean;

  getPos(data) {
    const haveAccess = ['RM', 'CRO'];
    const bsRole = 'BUSINESS_SUPPORT';

    const positions = data[0].positions;
    const posLoc = this.getLocStor('POS');

    // find id on positions that same with posLoc
    const pos = positions.find(o => o.id === Number(posLoc));

    // get positionTypeId from positions with pos.id
    const posType = pos.positionTypeId;

    this.isBusinessSupport = posType === bsRole ? true : false;
    this.getStatus(this.isBusinessSupport);
    this.getRequestSliks(this.isBusinessSupport);

    // if haveAccess contains posType, set isHasAddSlikPermission to true
    if (haveAccess.includes(posType)) {
      this.isHasAddSlikPermission = true;
    } else {
      this.isHasAddSlikPermission = false;
    }
  }

  constructor(
    private internalService: InternalService,
    protected messageService: MessageService,
    protected lovAndStatusService: RequestSlikStatusService,
    protected applicationStateLogService: ApplicationStateLogService,
    public dialog: MatDialog,
    protected requestSlikTimelineService: RequestSlikTimelineService,
    public requestSlikBucketService: RequestSlikBucketService,
    public accountService: AccountService,
    public employeeService: EmployeeService
  ) {
    this.iconTimeline = faTimeline;

    this.accountService.identity().subscribe(account => {
      if (account) {
        this.employeeService
          .queryFilterBy({
            page: 0,
            query: 999,
            eqLogin: account.login,
            sort: ['id,desc'],
          })
          .subscribe(res => this.getPos(res.body));
      }
    });
  }

  private loadInternalById(internalId: string): Promise<IInternal> {
    return new Promise<IInternal>((resolve, reject) => {
      this.internalService.find(internalId).subscribe(res => {
        if (res.body) {
          resolve(res.body);
        } else {
          resolve(null);
        }
      });
    });
  }

  rmBranch;
  rmSegment;

  public previousState(): void {
    window.history.back();
  }

  loadItem(item: any) {
    return this.internalService.find(item.internalId).pipe(
      switchMap(async internal => {
        if (internal.body.parentId) {
          this.rmBranch = await this.loadInternalById(internal.body.parentId.toString());
          this.rmSegment = await this.loadInternalById(this.rmBranch.parentId.toString());
          item.segment = this.rmSegment.organizationName;
        }
        return item;
      })
    );
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

  totalItemCount;
  getData(
    page = this.pageIndex,
    size = 10,
    sort = 'dateCreate,desc',
    idPosition = this.getLocStor('POS'),
    isBusinessSupport: boolean = this.isBusinessSupport
  ) {
    this.requestSlikBucketService.getAllData(page, size, sort, idPosition, isBusinessSupport).subscribe({
      next: data => {
        if (data.length === 0) {
          this.dataSource = new MatTableDataSource([]);
          this.isLoading = false;
        }
        Promise.all(data.data.map(item => this.loadItem(item).toPromise())).then(() => {
          this.dataSource = new MatTableDataSource(data.data);
          this.paginator.length = data.pageable.totalElements || 0;
          this.isLoading = false;
        });
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        this.dataSource = new MatTableDataSource([]);
        this.isLoading = false;
      },
    });
  }

  getRequestSliks(
    isBusinessSupport = this.isBusinessSupport,
    page = this.pageIndex,
    size = 10,
    sort = 'dateCreate,desc',
    idPosition = this.getLocStor('POS')
  ) {
    this.requestSlikBucketService.getAllRequestSliks(isBusinessSupport, page, size, sort, idPosition).subscribe({
      next: data => {
        if (data.length === 0) {
          this.dataSource = new MatTableDataSource([]);
          this.isLoading = false;
        } else {
          console.log(data.data);

          this.dataSource = new MatTableDataSource(data.data);
          this.paginator.length = data.pageable.totalElements || 0;
          this.isLoading = false;
        }
      },
      error: err => {
        console.log(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        this.dataSource = new MatTableDataSource([]);
        this.isLoading = false;
      },
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    // this.getData();
  }

  public showTimeLine(element: IRequestSlik): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('SLIK', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.requestSlikTimelineService.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(() => {});
    });
  }

  public requestSlikStatusCodes: IOptionNode[] = [];
  getStatus(isBusinessSupport: boolean) {
    this.lovAndStatusService.getStatuses(isBusinessSupport).subscribe(res => {
      this.requestSlikStatusCodes = res;
    });
  }
  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.requestSlikStatusCodes, event.previousIndex, event.currentIndex);
  }

  public clickedChip = '';
  public chipClick(option): void {
    this.isLoading = true;

    if (this.clickedChip === option) {
      document.getElementById('statusOption').style.backgroundColor = 'whitesmoke';
      this.clickedChip = '';
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // this.getData();
      this.getRequestSliks();
    } else {
      this.clickedChip = option;

      // Get Data By Option
      this.requestSlikBucketService.searchRequestSlikByStatus(option).subscribe({
        next: data => {
          if (data.length === 0) {
            this.dataSource = new MatTableDataSource([]);
            this.isLoading = false;
          }
          data.data &&
            data.data.length > 0 &&
            Promise.all(data.data.map(item => this.loadItem(item).toPromise())).then(() => {
              this.dataSource = new MatTableDataSource(data.data);
              this.paginator.length = data.pageable.totalElements || 0;
              this.isLoading = false;
            });
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          this.isLoading = false;
          this.dataSource = new MatTableDataSource([]);
        },
      });
    }
  }

  clearSearch() {
    this.searchCif = '';
    this.isLoading = true;
    // this.getData(0);
    this.getRequestSliks(this.isBusinessSupport, 0);
  }

  // === SEARCH REQUEST SLIK BUCKET
  searchReqSlik(query) {
    this.isLoading = true;
    this.clickedChip = '';
    this.requestSlikBucketService.searchRequestSlik(query, this.pageIndex).subscribe({
      next: data => {
        if (data.length === 0) {
          this.dataSource = new MatTableDataSource([]);
          this.isLoading = false;
        }
        Promise.all(data.data.map(item => this.loadItem(item).toPromise())).then(() => {
          this.dataSource = new MatTableDataSource(data.data);
          this.paginator.length = data.pageable.totalElements || 0;
          this.isLoading = false;
        });
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        this.dataSource = new MatTableDataSource([]);
        this.isLoading = false;
      },
    });
  }

  searchCif: string | number = '';

  paginate(event: any) {
    this.isLoading = true;
    const page = event.pageIndex;
    const pageSize = event.pageSize;

    this.searchCif !== ''
      ? this.searchReqSlik(this.searchCif)
      : this.clickedChip !== ''
      ? this.chipClick(this.clickedChip)
      : this.getRequestSliks(this.isBusinessSupport, page, pageSize);
  }

  pageIndex = 0;
}
