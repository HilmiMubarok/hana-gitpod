import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { LoanAnalysService } from './loan-analys.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import lodash from 'lodash';

import { PositionService } from 'app/entities/position/position.service';

import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { IApplicationStateLog } from '../application-state-log/application-state-log.model';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';
import { CashLoanAnalysService } from './cash-loan-analys.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { CashCreditProposalService } from '../credit-proposal/cash-credit-proposal.service';
import { TemplateService } from 'app/layouts/template/template.service';
@Component({
  selector: 'jhi-loan-analys-m',
  templateUrl: './loan-analys-m.component.html',
  styleUrls: ['./loan-analys-m.css'],
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
export class LoanAnalysMComponent extends AbstractEntityMaterialComponent<ICreditProposal> implements OnInit {
  public activeRoute: string;
  public displayedColumns: string[] = [
    'no',
    'proposalNumber',
    'applicationTypeDescription-proposalType',
    'cif',
    'customerName',
    'customerType',
    'createdDate',
    'status',
    'action',
  ];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: any;
  public statusCodesData: Object[] = [];
  public iconTimeline: any;
  public isShow: boolean;
  public title: string;
  public positionIdLocStor: string;
  public statusSearch = false;
  constructor(
    private loanAnalysService: LoanAnalysService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    private positionService: PositionService,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected applicationConfigService: ApplicationConfigService,
    public creditProposalService: CreditProposalService,
    private cashLoanAnalysService: CashLoanAnalysService,
    private cashCreditProposalService: CashCreditProposalService,
    private templateService: TemplateService
  ) {
    super(_snackBar, loanAnalysService);
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
  }

  public closeSearch() {
    this.statusSearch = false;
    this.currentSearch = '';
    this.page = 0;

    this.loadAll();
  }

  public doSearch(): void {
    this.statusSearch = true;
    const predicate: object = {
      page: this.page,
      query: this.currentSearch,
      size: this.itemsPerPage,
      sort: this.sortData(),
      idPosition: this.positionIdLocStor,
    };

    if (this.activeRoute === 'la-distribution') {
      predicate['target'] = 'loan-analyst-distribution';
    } else if (this.activeRoute === 'la-analyst') {
      predicate['target'] = 'loan-analyst';
    } else if (this.activeRoute === 'la-SME-CRC') {
      predicate['target'] = 'loan-analyst-sme-checker';
    } else if (this.activeRoute === 'la-approval') {
      predicate['target'] = 'loan-analyst-approval';
    } else if (this.activeRoute === 'la-approval-inquiry') {
      predicate['target'] = 'loan-analyst-approval-inquiry';
    } else if (this.activeRoute === 'dar-final') {
      predicate['target'] = 'dar-final';
    } else if (this.activeRoute === 'dar-checker') {
      predicate['target'] = 'dar-checker';
    } else if (this.activeRoute === 'loan-committee-approval') {
      predicate['target'] = 'loan-committee-approval';
    } else if (this.activeRoute === 'dar-notif') {
      predicate['target'] = 'dar-notif';
    } else if (this.activeRoute === 'cc-distribution') {
      predicate['target'] = 'complience-checking-distribution';
    } else if (this.activeRoute === 'cc-checking') {
      predicate['target'] = 'complience-checking';
    } else if (this.activeRoute === 'cc-inquiry') {
      predicate['target'] = 'complience-checking-inquiry';
    } else if (this.activeRoute === 'cc-review') {
      predicate['target'] = 'complience-checking-review';
    } else if (this.activeRoute === 'loan-analys-and-approval-monitoring') {
      predicate['target'] = 'loan-analyst-and-approval-monitoring';
    }

    this.cashCreditProposalService
      .searchCP(predicate)
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
    return;
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
    if (this.currentSearch === '' || this.currentSearch === undefined || this.currentSearch === null) {
      this.loadAll();
    } else {
      this.doSearch();
    }
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

  private loadAll(): void {
    this.loading = true;
    let menu = this.convertStatusActivateRoute(this.activeRoute);
    if (menu === 'loan-analys-and-approval-monitoring') {
      menu = 'la-approval';
    }
    if (!this.positionIdLocStor) {
      this.templateService.changePosInt('Empty');
      this.router.navigate(['']);
    } else {
      if (this.activeRoute === 'la-distribution') {
        this.getStatusListView('LOAN_ANALYSIS_DISTRIBUTION');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysDistribution({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysDistribution({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'la-analyst') {
        this.getStatusListView('LOAN_ANALYSIS');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisys({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisys({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'la-SME-CRC') {
        this.getStatusListView('LOAN_ANALYSIS_SME_CREDIT_REVIEW_CHECKER');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysSMECRC({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysSMECRC({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'la-approval') {
        this.getStatusListView('LOAN_APPROVAL');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysApproval({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysApproval({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'la-approval-inquiry') {
        this.getStatusListView('LOAN_APPROVAL_INQUIRY');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysInquiry({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysInquiry({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'dar-final') {
        this.getStatusListView('DAR_FINALIZATION');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysDarfinal({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysDarfinal({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'loan-committee-approval') {
        this.getStatusListView('LOAN_KOMITE_APPROVAL');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysDarLoanKomiteApproval({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysDarLoanKomiteApproval({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'dar-notif') {
        this.getStatusListView('DAR_NOTIFICATION');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysDarNotif({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysDarNotif({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'cc-distribution') {
        this.getStatusListView('COMPLIANCE_CHECKING_DISTRIBUTION');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysCCDistribution({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysCCDistribution({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'cc-checking') {
        this.getStatusListView('COMPLIANCE_CHECKING');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysCCChecking({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysCCChecking({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'cc-inquiry') {
        this.getStatusListView('COMPLIANCE_CHECKING_INQUIRY');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysCCInquiry({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysCCInquiry({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'cc-review') {
        this.getStatusListView('COMPLIANCE_CHECKING_REVIEW');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysCCRevew({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysCCRevew({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'dar-checker') {
        this.getStatusListView('FINAL_DAR_CHECKER');
        if (this.clickedChip['statusId'] !== '') {
          this.cashLoanAnalysService
            .loanAnalisysDarChecker({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashLoanAnalysService
            .loanAnalisysDarChecker({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      }
    }
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
        data[i]['rmName'] = data[i].ownerPosition
          ? data[i].ownerPosition.employeeFirstName + ' ' + data[i].ownerPosition.employeeLastName
          : '';

        if (data[i]['prospectPerson'] !== null) {
          data[i]['prospectPerson']['maritalStatus'] = data[i]['prospectPerson']['maritalStatus']
            ? data[i]['prospectPerson']['maritalStatus']
            : '';
        }

        if (data[i].ownerPosition) {
          this.findPositionByIdParty(data[i].ownerPosition.partyId).then(res => {
            data[i]['rmBranch'] = res;
          });
        }

        for (let k = 0; k < data[i].addresses.length; k++) {
          if (data[i].addresses[k].purposeTypeId === 'PRIMARY_LOCATION') {
            data[i]['addressF'] = data[i].addresses[k].address.address1;
          }
        }
        const statusDist = 'Distribution';
        for (let h = 0; h < data[i].statusDescription.length; h++) {
          if (data[i].statusDescription === 'Ol Distribution') {
            data[i].statusDescription = data[i].statusDescription.replace(/Ol Distribution/gi, statusDist);
          }
        }
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
  public getStatusListView(appMenu: string) {
    this.cashCreditProposalService
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

  getText(value: any) {
    if (value === 'la-distribution') {
      this.title = 'Loan Analysis Distribution';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'la-analyst') {
      this.title = 'Loan Analysis';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'la-SME-CRC') {
      this.title = 'Loan Analysis SME Checker';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'la-approval') {
      this.title = 'Loan Approval';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'la-approval-inquiry') {
      this.title = 'Loan Approval Inquiry';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'dar-final') {
      this.title = 'DAR Finalization';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'dar-checker') {
      this.title = 'Final DAR - Checker';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'loan-committee-approval') {
      this.title = 'Loan Komite Approval';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'dar-notif') {
      this.title = 'DAR Notification';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'cc-distribution') {
      this.title = 'Compliance Checking Distribution';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'cc-checking') {
      this.title = 'Compliance Checking';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'cc-review') {
      this.title = 'Compliance Checking Review';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'cc-inquiry') {
      this.title = 'Compliance Checking Inquiry';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'loan-analys-and-approval-monitoring') {
      this.title = 'Loan Analyst and Approval Monitoring';
      sessionStorage.setItem('appName', this.title);
    }
  }
}
