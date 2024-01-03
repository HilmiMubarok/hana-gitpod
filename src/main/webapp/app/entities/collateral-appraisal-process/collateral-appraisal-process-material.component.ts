import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { IApplicationStateLog } from '../application-state-log/application-state-log.model';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { CreditProposal, ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IStateBoundary } from '../state-boundary/state-boundary.model';
import { StateBoundaryService } from '../state-boundary/state-boundary.service';
import { ISurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import { HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import lodash from 'lodash';
import { IOptionNode, OptionNode } from 'app/shared/model/option-node.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import _ from 'lodash';
import { STATUS } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-collateral-appraisal-process-material',
  templateUrl: './collateral-appraisal-process-material.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css'],
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
export class CollateralAppraisalProcessMaterialComponent extends AbstractEntityMaterialComponent<ISurveyAppraisals> implements OnInit {
  public displayedColumns: string[] = [
    'no',
    'appraisalNumber',
    'cif',
    'customerName',
    'customerType',
    'createdDate',
    'collateralType',
    'status',
    'action',
  ];
  public account: Account;
  public creditProposal: ICreditProposal;
  public globalSearchVal: string;
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: string;
  public iconTimeline: any;
  public filterData: {
    [key: string]: Object;
  }[] = [];
  public globalSearchValModel: string;
  public collateralAppraisalStatusCodes: IOptionNode[] = [
    {
      id: 'DRAFT',
      label: 'Draft',
    },
    {
      id: 'RETURN_TO_RM',
      label: 'Return To RM',
    },
    {
      id: 'ASSIGNMENT',
      label: ' Assignment',
    },
    {
      id: 'RETURN_TO_ADMIN',
      label: 'Return To Admin',
    },
    {
      id: 'ASSIGNED',
      label: 'Assigned',
    },
    {
      id: 'VISITED',
      label: 'Visited',
    },
    {
      id: 'REPORTED',
      label: 'Reported',
    },
    {
      id: 'RETURN_TO_OFFICER',
      label: 'Return To Officer',
    },
    {
      id: 'APPROVAL',
      label: 'Approval',
    },
    {
      id: 'APPEAL',
      label: 'Appeal',
    },
    {
      id: 'APPROVED',
      label: 'Approved',
    },
  ];
  constructor(
    protected _snackBar: MatSnackBar,
    protected stateBoundaryService: StateBoundaryService,
    protected surveyAppraisalService: SurveyAppraisalsService,
    protected creditProposalService: CreditProposalService,
    protected applicationStateLogService: ApplicationStateLogService,
    public accountService: AccountService,
    protected dialog: MatDialog,
    protected router: Router
  ) {
    super(_snackBar, surveyAppraisalService);
    this.globalSearchValModel = '';
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.creditProposal = new CreditProposal();
    this.clickedChip = '';
    this.iconTimeline = faTimeline;
    this.currentSearch = null;
  }

  ngOnInit(): void {
    this.loadCity();
    this.loadAll();
    this.filterStatusCode();
    this.filterStatusCodeProcess();
  }

  public urlReportInqury = this.router.url === '/collateral-appraisal-result-inqury';
  public urlReportApproval = this.router.url === '/collateral-appraisal-report-approval';
  public urlAppraisalProcess = this.router.url === '/collateral-appraisal-process';
  public urlRequestAppraisal = this.router.url === '/collateral-appraisal';
  public urlAppraisalInternal = this.router.url === '/collateral-appraisal-distribution-internal';

  public filterStatusCodeProcess() {
    if (this.urlAppraisalProcess) {
      this.collateralAppraisalStatusCodes = [
        {
          id: 'ASSIGNED',
          label: 'Assigned',
        },
        {
          id: 'VISITED',
          label: 'Visited',
        },
        {
          id: 'RETURN_TO_OFFICER',
          label: 'Return To Officer',
        },
        {
          id: 'APPROVAL_TL',
          label: 'Approval Team Leader',
        },
        {
          id: 'APPROVAL_DEPT_HEAD',
          label: 'Approval Dept Head',
        },
        {
          id: 'APPROVAL_DH',
          label: 'Approval Div Head',
        },
        {
          id: 'APPROVED',
          label: 'Approve',
        },
      ];
    }
    if (this.isSurveyor()) {
      if (this.account.authorities.length <= 2) {
        // delete reported if user logged in is surveyor
        this.collateralAppraisalStatusCodes = this.collateralAppraisalStatusCodes.filter(item => item.id !== 'REPORTED');
      }
    }
  }
  public filterStatusCode() {
    if (this.urlAppraisalInternal) {
      this.collateralAppraisalStatusCodes = [
        {
          id: 'ASSIGNMENT',
          label: 'Assignment',
        },
      ];
    }
  }

  public findCreditProposalBySurveyAppraisal(params: ISurveyAppraisals): void {
    this.creditProposalService.findByCif(params.cif.customerId).subscribe(res => {
      // this.creditProposal = res.body[0];
      const result: ICreditProposal = res.body[0];
      if (result) {
        this.creditProposal = result;
      }
    });
  }

  public isSurveyor(): any {
    return this.account.authorities.includes('ROLE_SURVEYOR');
  }

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public loadAll(): void {
    this.checkLogin();
    this.loading = true;

    if (this.clickedChip !== '') {
      this.surveyAppraisalService
        .getBySurveyorByStatus({
          page: this.page,
          statusId: this.clickedChip,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .subscribe({
          next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
    }

    if (this.currentSearch && this.currentSearch !== '') {
      this.surveyAppraisalService
        .searchNew(
          {
            page: this.page,
            query: this.currentSearch,
            size: this.itemsPerPage,
            sort: ['id,desc'],
          },
          'Internal'
        )
        .subscribe({
          next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      // this.surveyAppraisalService
      //   .searchBySurveyor({
      //     page: this.page,
      //     query: this.currentSearch,
      //     size: this.itemsPerPage,
      //     sort: ['id,desc'],
      //   })
      //   .subscribe({
      //     next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
      //     error: (res: HttpErrorResponse) => this.onError(res.message),
      //   });
      return;
    }

    if (this.globalSearchVal) {
      this.surveyAppraisalService
        .searchNew(
          {
            page: this.page,
            query: this.currentSearch,
            size: this.itemsPerPage,
            sort: ['id,desc'],
          },
          'Internal'
        )
        .subscribe({
          next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      // this.surveyAppraisalService
      //   .searchBySurveyor({
      //     page: this.page,
      //     query: this.globalSearchVal,
      //     size: this.itemsPerPage,
      //     sort: ['id,desc'],
      //   })
      //   .subscribe({
      //     next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
      //     error: (res: HttpErrorResponse) => this.onError(res.message),
      //   });
      return;
    }

    if (this.urlAppraisalInternal) {
      this.surveyAppraisalService
        .filterBySurveyor({
          page: this.page,
          idStatus: STATUS.ASSIGNMENT,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .subscribe({
          next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    if (this.clickedChip === '') {
      this.surveyAppraisalService
        .getBySurveyor({
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .subscribe({
          next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }
  }

  private initDataForMatTableCustom(data: any, headers: HttpHeaders) {
    let customItem = [];
    customItem = this.addIdx(data.body);
    customItem = this.addCustomItem(customItem);
    this.items = new MatTableDataSource(customItem);
    if (!this.items) {
      this.items.paginator = this.paginator;
    }
    this.items.sort = this.sort;
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
    this.loading = false;
  }

  private addCustomItem(data: ISurveyAppraisals[]) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].collateral === null) {
          const defaultCollateralNull = {
            collateralTypeDescription: '',
            collateralAddress: {
              address1: '',
            },
            collateralCityName: '',
          };
          data[i].collateral = defaultCollateralNull;
        }
      }
    }
    return data;
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
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

  public showTimeLine(element: ISurveyAppraisals): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('APPRAISAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: {
          content: this.convertToTimelineModel(res.body),
        },
      });
      dialogRef.afterClosed().subscribe(res2 => {
        console.log(res2);
      });
    });
  }

  private loadCity(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['city'],
        size: 9999,
      })
      .subscribe((res: HttpResponse<IStateBoundary[]>) => {
        let town;
        for (let i = 0; i < res.body.length; i++) {
          town = {};
          town = {
            id: res.body[i].id,
            description: res.body[i].description,
          };
          this.filterData.push(town);
        }
      });
  }

  public onSelectTown(args: any): void {
    this.currentSearch = null;
    this.clickedChip = '';
    this.doSearch(args);
  }

  public previousState(): void {
    window.history.back();
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.collateralAppraisalStatusCodes, event.previousIndex, event.currentIndex);
  }

  public chipClick(option: IOptionNode): void {
    this.page = 0;
    if (this.clickedChip === option.id) {
      document.getElementById('statusOption').style.backgroundColor = 'whitesmoke';
      this.clickedChip = '';
    } else {
      this.clickedChip = option.id;
    }
    this.loadAll();
  }

  public doSearch(args: any = null): void {
    if (this.currentSearch) {
      this.router.navigate(['collateral-appraisal-process'], {
        queryParams: {
          search: this.currentSearch,
        },
      });

      this.chipClick({
        id: this.clickedChip,
        label: this.clickedChip,
      });
    } else {
      if (args) {
        const val: string = args.value;
        if (val !== '') {
          const searchVal = '*' + args.value + '*';
          this.globalSearchVal = searchVal;
          this.globalSearchValModel = args.value;
          this.router.navigate(['collateral-appraisal-process'], {
            queryParams: {
              searchByTown: searchVal,
            },
          });
          this.loadAll();
          return;
        }
        this.globalSearchVal = '';
        this.globalSearchValModel = '';
        this.router.navigate(['collateral-appraisal-process'], {});
        this.loadAll();
      } else {
        this.router.navigate(['collateral-appraisal-process']);
        this.loadAll();
      }
    }
  }

  public goToEdit(): void {
    this.router.navigate(['./collateral-appraisal/new']);
  }
}
