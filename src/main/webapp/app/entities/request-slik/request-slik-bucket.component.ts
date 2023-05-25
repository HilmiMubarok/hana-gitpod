import { Component, OnInit, ViewChild } from '@angular/core';
import { IRequestSlik } from './request-slik.model';
import { Observable, finalize, map } from 'rxjs';
import { RequestSlikService } from './request-slik.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { IInternal } from '../internal/internal.model';
import { InternalService } from '../internal/internal.service';
import { MessageService } from 'primeng/api';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { MatSort } from '@angular/material/sort';
import { RequestSlikStatusService } from './services/request-slik-status.service';
import _ from 'lodash';
import { RequestSlikSearchService } from './services/request-slik-search.service';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { IApplicationStateLog } from '../application-state-log/application-state-log.model';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';

@Component({
  selector: 'jhi-request-slik-bucket',
  templateUrl: './request-slik-bucket.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css'],
})
export class RequestSlikBucketComponent implements OnInit {
  requestSliks$: Observable<IRequestSlik[]>;
  isLoading: Boolean = true;
  items: IRequestSlik[];
  displayedColumns: string[] = ['id', 'requestNumber', 'cif', 'debtorName', 'customerType', 'segment', 'requestDate', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  iconTimeline: any;

  constructor(
    private requestSlikService: RequestSlikService,
    private internalService: InternalService,
    protected messageService: MessageService,
    protected lovAndStatusService: RequestSlikStatusService,
    protected requestSlikSearchService: RequestSlikSearchService,
    protected applicationStateLogService: ApplicationStateLogService,
    public dialog: MatDialog
  ) {
    // this.requestSliks$ = this.requestSlikService.getData().pipe(finalize(() => (this.isLoading = false)));
    this.getStatus();
    this.iconTimeline = faTimeline;
    this.loadInternalInformationRM();
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

  private loadRegional(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.regionals = res.body;
        resolve();
      });
    });
  }

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        resolve();
      });
    });
  }

  branchs;
  segments;
  regionals;
  rmBranch;
  rmSegment;
  rmRegional;

  private loadInternalInformationRM(): void {
    this.branchs = [];
    this.segments = [];
    this.regionals = [];
    this.loadInternalById('1101').then((res2: IInternal) => {
      if (res2.parentId) {
        this.rmBranch = res2;
        this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
          this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
            if (res4.parentId) {
              this.rmRegional = res4;
              this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                  this.rmSegment = res6;
                  console.log('rmSegment', this.rmSegment);
                });
              });
            }
          });
        });
      }
    });
  }

  public previousState(): void {
    window.history.back();
  }

  get requestSliks() {
    return this.items;
  }

  set requestSliks(requestSlik: IRequestSlik[]) {
    this.items = requestSlik;
  }

  totalItemCount;
  getData(page = 1, size = 10, sort = 'dateCreate,desc') {
    this.requestSlikService.getDataServerSidePagination(page, size, sort).subscribe({
      next: data => {
        console.log('data', data);

        // Modify status label
        const modifiedData = _.map(data, obj => {
          if (obj.status === 'DRAFT') {
            return { ...obj, status: 'Draft' };
          } else if (obj.status === 'APPROVAL_BU') {
            return { ...obj, status: 'Approval SLIK By BU' };
          } else if (obj.status === 'APPROVAL_SLIK') {
            return { ...obj, status: 'Approval SLIK By Team SLIK' };
          } else if (obj.status === 'CHECKING') {
            return { ...obj, status: 'Checking In Progress' };
          } else if (obj.status === 'RETURN_TO_RM') {
            return { ...obj, status: 'Return To RM' };
          } else if (obj.status === 'VERIFY') {
            return { ...obj, status: 'Verify' };
          } else if (obj.status === 'COMPLETE') {
            return { ...obj, status: 'Complete' };
          }
          return obj;
        });

        // modifiedData = modifiedData.filter(res => res.status !== 'CANCEL');

        // == get segment
        modifiedData.forEach(item => {
          this.loadInternalById(item.internalId).then((res2: IInternal) => {
            if (res2.parentId) {
              this.rmBranch = res2;
              this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
                this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                  if (res4.parentId) {
                    this.rmRegional = res4;
                    this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                      this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                        this.rmSegment = res6;
                        item.segment = res6.organizationName;
                      });
                    });
                  }
                });
              });
            }
          });
        });
        // == end get segment
        this.dataSource = new MatTableDataSource(modifiedData);
        this.totalItemCount = modifiedData.length;
        this.dataSource.paginator = this.paginator;
      },
      error: err => {
        console.log('err', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        setTimeout(() => {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource([]);
        }, 1000);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private loadSegment(): void {
    this.internalService.queryFilterBy({ idInternalType: APPLICATION_TYPE.BUSINESS_UNIT, size: 9999, page: 0 }).subscribe(res => {
      this.segments = res.body;
    });
  }

  ngOnInit() {
    this.lovAndStatusService.getLovProposeCode().subscribe(res => console.log('LOV', res));
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getData();
  }

  sortData(event: any) {
    const sort = event.active + ',' + event.direction;
    this.getData(1, 10, sort);
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

  public showTimeLine(element: IRequestSlik): void {
    console.log(element);
    this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(res2 => {});
    });
  }

  public requestSlikStatusCodes: IOptionNode[] = [];
  getStatus() {
    this.lovAndStatusService.getStatuses().subscribe(res => {
      console.log(
        'res status',
        res[0].filter(d => d.id !== 'CANCEL')
      );
      // this.requestSlikStatusCodes = res[0].filter(d => d.id !== 'CANCEL');
      this.requestSlikStatusCodes = res[0];
      console.log('this.requestSlikStatusCodes', this.requestSlikStatusCodes[0]);
    });
  }
  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.requestSlikStatusCodes, event.previousIndex, event.currentIndex);
  }

  public clickedChip;
  trackByFn(index, item) {
    return item.id; // or any other unique identifier
  }

  public chipClick(option): void {
    this.isLoading = true;

    if (this.clickedChip === option) {
      document.getElementById('statusOption').style.backgroundColor = 'whitesmoke';
      this.clickedChip = '';
      this.dataSource = new MatTableDataSource();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.getData();
    } else {
      this.clickedChip = option;

      // Get Data By Option
      this.requestSlikService.searchByStatus(option).subscribe({
        next: res => {
          // empty data
          this.dataSource.data = res.length === 0 && [];

          const modifiedData = _.map(res, obj => {
            if (obj.status === 'DRAFT') {
              return { ...obj, status: 'Draft' };
            } else if (obj.status === 'APPROVAL_BU') {
              return { ...obj, status: 'Approval SLIK By BU' };
            } else if (obj.status === 'APPROVAL_SLIK') {
              return { ...obj, status: 'Approval SLIK By Team SLIK' };
            } else if (obj.status === 'CHECKING') {
              return { ...obj, status: 'Checking In Progress' };
            } else if (obj.status === 'RETURN_TO_RM') {
              return { ...obj, status: 'Return To RM' };
            } else if (obj.status === 'VERIFY') {
              return { ...obj, status: 'Verify' };
            } else if (obj.status === 'COMPLETE') {
              return { ...obj, status: 'Complete' };
            }
            return obj;
          });

          modifiedData.forEach(item => {
            this.loadInternalById(item.internalId).then((res2: IInternal) => {
              if (res2.parentId) {
                this.rmBranch = res2;
                this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
                  this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                    if (res4.parentId) {
                      this.rmRegional = res4;
                      this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                        this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                          this.rmSegment = res6;
                          item.segment = res6.organizationName;
                        });
                      });
                    }
                  });
                });
              }
            });
          });

          // modifiedData = modifiedData.filter(resData => resData.status !== 'CANCEL');
          this.dataSource.data = modifiedData.length === 0 ? [] : modifiedData;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  clearSearch() {
    this.searchCif = null;
    this.isLoading = true;
    this.getData();
  }

  // === SEARCH REQUEST SLIK BUCKET
  searchReqSlik(data) {
    return this.requestSlikSearchService.searchRequestSlik(data).subscribe(res => {
      console.log('SEARCH', res);

      this.dataSource.data = res.length === 0 && [];

      // Modify status label
      const modifiedData = _.map(res, obj => {
        if (obj.status === 'DRAFT') {
          return { ...obj, status: 'Draft' };
        } else if (obj.status === 'APPROVAL_BU') {
          return { ...obj, status: 'Approval SLIK By BU' };
        } else if (obj.status === 'APPROVAL_SLIK') {
          return { ...obj, status: 'Approval SLIK By Team SLIK' };
        } else if (obj.status === 'CHECKING') {
          return { ...obj, status: 'Checking In Progress' };
        } else if (obj.status === 'RETURN_TO_RM') {
          return { ...obj, status: 'Return To RM' };
        } else if (obj.status === 'VERIFY') {
          return { ...obj, status: 'Verify' };
        } else if (obj.status === 'COMPLETE') {
          return { ...obj, status: 'Complete' };
        }
        return obj;
      });

      // modifiedData = modifiedData.filter(modified => modified.status !== 'CANCEL');

      // == get segment
      modifiedData.forEach(item => {
        this.loadInternalById(item.internalId).then((res2: IInternal) => {
          if (res2.parentId) {
            this.rmBranch = res2;
            this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                  this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                    this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                      this.rmSegment = res6;
                      item.segment = res6.organizationName;
                    });
                  });
                }
              });
            });
          }
        });
      });
      // == end get segment
      this.dataSource.data = modifiedData.length === 0 ? [] : modifiedData;
    });
  }

  searchCif: number;
  searchByCif(cif) {
    this.isLoading = true;
    this.requestSlikService.searchByCif(cif).subscribe({
      next: data => {
        // console.log('data', data);
        this.dataSource.data = data;
      },
      complete: () => {
        this.isLoading = false;
      },
    });

    // this.dataSource.data = cif && this.requestSlikService.searchByCif(cif).pipe(finalize(() => (this.isLoading = false)));
  }

  // byid
  // byrequestnumber

  paginate(event: any) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.getData(page, limit, 'id,desc');
  }

  pageIndex;
  pageSize;
  onPageChange(event: PageEvent) {
    this.isLoading = true;
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getData(this.pageIndex, this.pageSize, 'id,desc');
  }
}
