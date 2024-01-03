import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
  selector: 'jhi-collateral-appraisal-material-internal',
  templateUrl: './collateral-appraisal-material-internal.component.html',
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
export class CollateralAppraisalMaterialInternalComponent extends AbstractEntityMaterialComponent<ISurveyAppraisals> implements OnInit {
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
  public activeRoute: string;
  public positionIdLocStor: string;
  public filterData: {
    [key: string]: Object;
  }[] = [];
  public statusSearch = false;
  public subMenu: object[];
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
    private templateService: TemplateService,
    protected router: Router,
    public cashSurveyAppraisalsService: CashSurveyAppraisalsService
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
    this.subMenu = OFFERING_LETTER_SURVEY_BATCH;
    this.positionIdLocStor = this.getLocStor('POS');
    this.filterStatusCode();
    this.loadCity();
    this.loadAll();
  }

  public urlAppraisalInternal = this.router.url === '/batch-apprisal/internal';

  public filterStatusCode() {
    if (this.urlAppraisalInternal) {
      this.queryListOfViewStatusFilterBy('APPRAISAL_DISTRIBUTION_INTERNAL');
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

  public loadAll(): void {
    this.checkLogin();
    this.loading = true;

    if (!this.positionIdLocStor) {
      this.templateService.changePosInt('Empty');
      this.router.navigate(['']);
    } else {
      if (this.clickedChip !== '') {
        this.cashSurveyAppraisalsService
          .cashSurveyAppraisalQueryFilterByInternal({
            page: this.page,
            idStatus: this.clickedChip,
            idPosition: this.positionIdLocStor,
            size: this.itemsPerPage,
            sort: this.sortData(),
          })
          .subscribe({
            next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
            error: (res: HttpErrorResponse) => this.onError(res.message),
          });
        return;
      }

      if (this.urlAppraisalInternal) {
        this.cashSurveyAppraisalsService
          .cashSurveyAppraisalQueryFilterByInternal({
            page: this.page,
            size: this.itemsPerPage,
            idPosition: this.positionIdLocStor,
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
    if (this.currentSearch === '' || this.currentSearch === undefined || this.currentSearch === null) {
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
      apprOfficer: 'INTERNAL',
      size: this.itemsPerPage,
      sort: this.sortData(),
      idPosition: this.positionIdLocStor,
    };

    if (this.activeRoute === 'batch-apprisalinternal') {
      predicate['target'] = 'appraisal-distribution-internal';
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

  public closeSearch() {
    this.statusSearch = false;
    this.currentSearch = '';
    this.page = 0;

    this.itemsPerPage = 10;
    this.loadAll();
  }

  public goToEdit(): void {
    this.router.navigate(['./collateral-appraisal/new']);
  }

  public routeSubMenu(menu: object): void {
    // this.router.navigate([this.router.url], { queryParams: { subroute: menu['id'] } });
    this.router.navigate(['./batch-apprisal/internal' + menu['id']]);
  }
}
