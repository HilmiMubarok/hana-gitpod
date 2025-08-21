import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { ICreditProposal } from '../../credit-proposal/credit-proposal.model';
import { LoanAnalysService } from '../../loan-analys/loan-analys.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import lodash from 'lodash';

import { PositionService } from 'app/entities/position/position.service';

import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../../application-state-log/application-state-log.service';
import { IApplicationStateLog } from '../../application-state-log/application-state-log.model';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Component({
  selector: 'jhi-party-cif-decision-approval-report',
  templateUrl: './party-cif-decision-approval-report.component.html',
  styleUrls: ['./party-cif-decision-approval-report.css'],
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
export class PartyCifDecisionApprovalReportComponent extends AbstractEntityMaterialComponent<ICreditProposal> implements OnInit {
  public activeRoute: string;
  public displayedColumns: string[] = [
    'no',
    'proposalNumber',
    'appealNumber',
    'applicationTypeDescription-proposalType',
    'customerName',
    'customerType',
    'createdDate',
    'status',
    'action',
  ];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip;
  public statusCodesData: Object[] = [];

  // public statusCodesDataRes: Object[] = [];

  public statusCodesDataLineUp: Object[] = [
    {
      id: 'CP_DAR_CHECKER',
      label: 'Final Dar Checker',
    },
    {
      id: 'LA_DAR_NOTIF',
      label: 'Dar Notification',
    },
  ];

  public iconTimeline: any;
  public isShow = false;
  public title: string;
  public id: string;
  public page: number;
  public clicked: boolean;

  constructor(
    private loanAnalysService: LoanAnalysService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    private positionService: PositionService,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected applicationConfigService: ApplicationConfigService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, loanAnalysService);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      id: '',
      label: '',
    };
    this.iconTimeline = faTimeline;
    // this.activeRoute = this.router.url.replace(/\//g, '');
    this.activeRoute = 'la-distribution';
  }

  // emiit tiitle
  // @Output() titleApp = new EventEmitter();

  /* private sortStatusCodesData(): void {
    for (let i = 0; i < this.statusCodesDataLineUp.length; i++) {
      for (let j = 0; j < this.statusCodesDataRes.length; j++) {
        if (this.statusCodesDataRes[j]['id'] === this.statusCodesDataLineUp[i]) {
          this.statusCodesData.push(this.statusCodesDataRes[j]);
        }
      }
    }
  } */

  private loadStatusChip(): void {
    this.loanAnalysService.getStatus(this.activeRoute).subscribe(res => {
      for (let i = 0; i < res.body.length; i++) {
        this.statusCodesData.push(res.body[i]);
        // this.isShow = true;
        if (i <= 1) {
          // this.isShow = false;
        }
      }
      // this.sortStatusCodesData();
    });
  }

  ngOnInit(): void {
    for (let i = 0; i < this.statusCodesDataLineUp.length; i++) {
      const passObj = this.statusCodesDataLineUp[i];
      this.statusCodesData.push(passObj);
      // this.isShow = true;
    }

    // this.loadStatusChip();
    this.loadAll();
  }

  public doSearch(): void {
    if (this.currentSearch && this.currentSearch !== '') {
      this.router.navigate([this.activeRoute], { queryParams: { search: this.currentSearch } });
      this.loadAll();
    } else {
      this.router.navigate([this.activeRoute]);
    }
  }

  private convertStatus(status: string) {
    let _status: string;
    _status = '';
    if (status === 'DRAFT') {
      _status = status;
    } else {
      _status = 'CP_' + status.replace(/ /g, '_');
    }
    return _status;
  }

  public chipClick(option): void {
    if (this.clicked && option.id === this.clickedChip.id) {
      this.loadAll();
      this.clicked = false;
      this.clickedChip = {
        id: '',
        label: '',
      };
    } else {
      this.loanAnalysService
        .queryFilterBy({
          page: this.page,
          idCif: this.id,
          idStatus: option.id,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .subscribe({
          next: (res: HttpResponse<ICreditProposal[]>) => {
            this.initDataForMatTable(res, res.headers);
          },
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      this.clicked = true;
      this.clickedChip = option;
    }

    console.log('clicked', this.clicked);
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  private convertStatusActivateRoute(activeRoute: string): string {
    let activeRouteHelper = activeRoute;
    if (activeRoute === 'la-SME-CRC') {
      activeRouteHelper = 'la-sme-crc';
    } else if (activeRoute === 'dar-final') {
      activeRouteHelper = 'la-dar-final';
    } else if (activeRoute === 'dar-checker') {
      activeRouteHelper = 'la-dar-checker';
    } else if (activeRoute === 'dar-notif') {
      activeRouteHelper = 'la-dar-notif';
    }
    return activeRouteHelper;
  }

  private loadAll(): void {
    this.loading = true;
    const dynamicURL: string = this.applicationConfigService.getEndpointFor(
      MICROSERVICENAME.LOS + '/api/loan-analisys/' + this.convertStatusActivateRoute(this.activeRoute)
    );

    this.loanAnalysService
      .getLaDarCheckerNotif(this.id, {
        page: 0,
        size: 999,
        sort: ['id,desc']
      })
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  initDataForMatTable(data: any, headers: HttpHeaders) {
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

  private addCustomItem(data: ICreditProposal[]) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].products.length; j++) {
          if (data[i].id === data[i].products[j].applicationId) {
            data[i]['maturityDate'] = !lodash.has(data[i].products[j].attributes, 'maturityDate')
              ? data[i].products[j].attributes.maturityDate
              : '';
          }
        }
        data[i]['proposalType'] = !lodash.has(data[i].attributes, 'proposalType') ? data[i].attributes.proposalType : '';

        // data[i]['rmName'] = data[i].rm ? data[i].rm.partyName : '';
        data[i]['rmName'] = data[i].rm ? data[i].rm.employeeFirstName + data[i].rm.employeeLastName : '';
        if (data[i].rm) {
          this.findPositionByIdParty(data[i].rm.partyId).then(res => {
            data[i]['rmBranch'] = res;
          });
        }

        for (let k = 0; k < data[i].addresses.length; k++) {
          if (data[i].addresses[k].purposeTypeId === 'PRIMARY_LOCATION') {
            data[i]['addressF'] = data[i].addresses[k].address.address1;
          }
        }

        // data[i].statusDescription = 'Complete';
        data[i].statusDescription = data[i].statusCode === 'OL_COMPLETE' ? 'Complete' : data[i].statusDescription;
      }
    }
    return data;
  }

  private findPositionByIdParty(partyId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.positionService.queryFilterBy({ idParty: partyId, size: 1, page: 0 }).subscribe(res => {
        if (res.body.length > 0) {
          resolve(res.body[0].internalName);
        } else {
          resolve(null);
        }
      });
    });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.statusCodesData, event.previousIndex, event.currentIndex);
  }

  public goToBulkBatchAssign(): void {
    this.router.navigate(['./loan-analys/batch-bulk-assign']);
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

  public showTimeLine(element: ICreditProposal): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(res2 => {
        console.log(res2);
      });
    });
  }

  private checkDataStatus(statusId: string): boolean {
    const statusList = ['CP_DAR_FINAL', 'CP_CC_DISTRIBUTION', 'CP_CC_ANALYST', 'CP_CC_DEPT_HEAD', 'CP_CC_DIV_HEAD', 'CP_CC_DIRECTOR'];
    const args = statusList.includes(statusId);
    if (args) {
      return true;
    } else {
      return false;
    }
  }

  public navigateToDarChecker(id: number, statusId: string): void {
    const toLoan: boolean = this.checkDataStatus(statusId);
    const path = toLoan ? 'confirmation' : 'history-proposal';
    this.router.navigate([path + '/' + id + '/edit']);
  }

  getText(value: any) {
    if (value === 'la-distribution') {
      this.title = 'Loan Analysis Distribution';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'la-analyst') {
      this.title = 'Loan Analysis';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'la-SME-CRC') {
      this.title = 'Loan Analysis SME Checker';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'la-approval') {
      this.title = 'Loan Approval';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'la-approval-inquiry') {
      this.title = 'Loan Approval Inquiry';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'dar-final') {
      this.title = 'DAR Finalization';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'dar-checker') {
      this.title = 'Final DAR - Checker';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'loan-committee-approval') {
      this.title = 'Loan Komite Approval';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'dar-notif') {
      this.title = 'DAR Notification';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'cc-distribution') {
      this.title = 'Compliance Checking Distribution';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'cc-checking') {
      this.title = 'Compliance Checking';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'cc-review') {
      this.title = 'Compliance Checking Review';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'cc-inquiry') {
      this.title = 'Compliance Checking Inquiry';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
    if (value === 'loan-analys-and-approval-monitoring') {
      this.title = 'Loan Analyst and Approval Monitoring';
      sessionStorage.setItem('appName', this.title);
      //   this.loanAnalysService.setTitile(this.title)
    }
  }
}
