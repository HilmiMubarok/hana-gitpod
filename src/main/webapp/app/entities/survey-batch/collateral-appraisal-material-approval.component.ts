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
import { GEO_BOUNDARY_TYPE, OFFERING_LETTER_SURVEY_BATCH } from 'app/shared/constants/base.constants';
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
import { map } from 'rxjs';
import { CashSurveyAppraisalsService } from '../survey-appraisals/cash-survey-appraisal.service';
import { TemplateService } from 'app/layouts/template/template.service';
@Component({
  selector: 'jhi-collateral-appraisal-material-approval',
  templateUrl: './collateral-appraisal-material-approval.component.html',
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
export class CollateralAppraisalMaterialApprovalComponent extends AbstractEntityMaterialComponent<ISurveyAppraisals> implements OnInit {
  public displayedColumns: string[] = [
    'no',
    'appraisalNumber',
    'cif',
    'customerName',
    'customerType',
    'createdDate',
    'collateralType',
    'appraisalType',
    'status',
    'action',
  ];
  public account: Account;
  public creditProposal: ICreditProposal;
  public globalSearchVal: string;
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: string;
  public iconTimeline: any;
  public activeRoute: string;
  public filterData: {
    [key: string]: Object;
  }[] = [];
  public subMenu: object[];
  public positionIdLocStor: string;
  public globalSearchValModel: string;
  public collateralAppraisalStatusCodes: any[] = [];
  constructor(
    protected _snackBar: MatSnackBar,
    protected stateBoundaryService: StateBoundaryService,
    protected surveyAppraisalService: SurveyAppraisalsService,
    protected creditProposalService: CreditProposalService,
    protected applicationStateLogService: ApplicationStateLogService,
    public accountService: AccountService,
    protected dialog: MatDialog,
    protected router: Router,
    public cashSurveyAppraisalsService: CashSurveyAppraisalsService,
    private templateService: TemplateService
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
    this.activeRoute = this.router.url.replace(/\//g, '');
  }

  ngOnInit(): void {
    this.positionIdLocStor = this.getLocStor('POS');
    this.subMenu = OFFERING_LETTER_SURVEY_BATCH;
    this.filterStatusCode();
    this.loadCity();
    this.loadAll();
  }

  public urlAppraisalApproval = this.router.url === '/batch-apprisal/approval';

  public queryListOfViewStatusFilterBy(appMenu: string) {
    this.cashSurveyAppraisalsService
      .queryListOfViewStatusFilterBy({
        page: 0,
        size: 9999,
        sort: ['id', 'asc'],
        appMenuId: appMenu,
      })
      .subscribe((res: any) => {
        this.collateralAppraisalStatusCodes = res.body;
      });
  }

  public filterStatusCode() {
    if (this.urlAppraisalApproval) {
      this.queryListOfViewStatusFilterBy('APPRAISAL_REPORT_APPROVAL');
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

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }
  public statusSearch = false;
  public closeSearch() {
    this.statusSearch = false;
    this.currentSearch = '';
    this.page = 0;

    this.itemsPerPage = 10;
    this.loadAll();
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

  public loadAll(): void {
    this.checkLogin();
    this.loading = true;
    if (!this.positionIdLocStor) {
      this.templateService.changePosInt('Empty');
      this.router.navigate(['']);
    } else {
      if (this.clickedChip !== '') {
        this.cashSurveyAppraisalsService
          .cashSurveyAppraisalQueryFilterByApproval({
            page: this.page,
            idStatus: this.clickedChip,
            size: this.itemsPerPage,
            idPosition: this.getLocStor('POS'),
            sort: this.sortData(),
          })
          .subscribe({
            next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
            error: (res: HttpErrorResponse) => this.onError(res.message),
          });
        return;
      }

      if (this.urlAppraisalApproval) {
        this.cashSurveyAppraisalsService
          .cashSurveyAppraisalQueryFilterByApproval({
            page: this.page,
            size: this.itemsPerPage,
            idPosition: this.getLocStor('POS'),
            sort: ['id,desc'],
          })
          .subscribe({
            next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
            error: (res: HttpErrorResponse) => this.onError(res.message),
          });
      }
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
    if (this.currentSearch === null || this.currentSearch === '' || this.currentSearch === undefined) {
      this.loadAll();
    } else {
      this.doSearch();
    }
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

  public chipClick(option: any): void {
    this.page = 0;
    if (this.clickedChip === option.statusId) {
      document.getElementById('statusOption').style.backgroundColor = 'whitesmoke';
      this.clickedChip = '';
    } else {
      this.clickedChip = option.statusId;
    }
    this.loadAll();
  }

  public doSearch(args: any = null): void {
    this.statusSearch = true;
    const predicate: object = {
      page: this.page,
      query: this.currentSearch,
      size: this.itemsPerPage,
      sort: this.sortData(),
      idPosition: this.positionIdLocStor,
    };

    if (this.activeRoute === 'batch-apprisalapproval') {
      predicate['target'] = 'appraisal-report-approval';
    }

    this.cashSurveyAppraisalsService
      .search(predicate)
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<ISurveyAppraisals[]>) => {
          this.initDataForMatTableCustom(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
    return;
  }

  public goToEdit(): void {
    this.router.navigate(['./collateral-appraisal/new']);
  }

  public routeSubMenu(menu: object): void {
    // this.router.navigate([this.router.url], { queryParams: { subroute: menu['id'] } });
    this.router.navigate(['./batch-apprisal/approval' + menu['id']]);
  }
}
