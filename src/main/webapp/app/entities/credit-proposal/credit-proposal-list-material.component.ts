import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { faBullseye, faTimeline } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { IApplicationStateLog } from '../application-state-log/application-state-log.model';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'jhi-credit-proposal-list-material',
  templateUrl: './credit-proposal-list-material.component.html',
  styleUrls: ['./credit-proposal-list.css'],
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
export class CreditProposalListMaterialComponent extends AbstractEntityMaterialComponent<ICreditProposal> implements OnInit {
  public displayedColumns: string[] = ['no', 'proposalNumber', 'cif', 'customerName', 'customerType', 'createdDate', 'status', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: Object;
  public iconTimeline: any;
  public statusCodesData: Object[] = [];
  public statusCodesDataRes: Object[] = [];
  public account: Account;
  public isRoleRM: boolean;
  public activeRoute: string;
  public title: string;
  public value: string;
  public parentPath = this.router.url.split('/')[1];
  constructor(
    private accountService: AccountService,
    private creditProposalService: CreditProposalService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected applicationConfigService: ApplicationConfigService
  ) {
    super(_snackBar, creditProposalService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      id: '',
      label: '',
    };
    this.iconTimeline = faTimeline;
    this.activeRoute = this.router.url.replace(/\//g, '');
  }

  ngOnInit(): void {
    this.loadStatusChip();
    this.loadAll();
    this.checkLogin();
    this.kagebunshinNoJutsu();
  }

  private loadStatusChip(): void {
    this.creditProposalService.getStatus(this.activeRoute).subscribe(res => {
      for (let i = 0; i < res.body.length; i++) {
        this.statusCodesData.push(res.body[i]);

        // special condition : rename label
        if (res.body[i].id === 'CP_RETURN_TO_RM') {
          this.statusCodesData[i]['label'] = 'Return To Credit Proposal (BU)';
        }
      }
    });
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
      _status = status.replace(/ /g, '_');
    }
    return _status;
  }

  public chipClick(option: Object): void {
    this.page = 0;
    if (this.clickedChip === option) {
      this.clickedChip = '';
    } else {
      if (option['id'] === 'CP_DRAFT') {
        this.clickedChip = { id: 'DRAFT', label: 'Draft' };
      } else {
        this.clickedChip = option;
      }
    }
    this.loadAll();
  }

  private convertStatusActivateRoute(activeRoute: string): string {
    let activeRouteHelper = activeRoute;
    if (activeRoute === 'cp-status-approval') {
      activeRouteHelper = 'cp-status-approval';
    } else if (activeRoute === 'credit-proposal-status') {
      activeRouteHelper = 'by-status';
    }
    return activeRouteHelper;
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  private checkReturnStatusDescription(data: ICreditProposal) {
	if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i].statusDescription = data[i].statusDescription.substring(0,2) === 'Ol' ? data[i].statusDescription.substring(3,data[i].statusDescription.length - 3) : data[i].statusDescription;
	  }
	}
  }

  private initDataForMatTable(data: any, headers: HttpHeaders) {
	let forCheckedItems = [];
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
    const dynamicURL: string = this.applicationConfigService.getEndpointFor(
      MICROSERVICENAME.LOS + '/api/credit-proposals/' + this.convertStatusActivateRoute(this.activeRoute)
    );
    if (this.clickedChip['id'] !== '') {
      this.creditProposalService
        .queryFilterBy({
          page: this.page,
          idStatus: this.convertStatus(this.clickedChip['id']),
          size: this.itemsPerPage,
          sort: ['id,desc'],
        })
        .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    if (this.currentSearch && this.currentSearch !== '') {
      this.creditProposalService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ICreditProposal[]>) => {
            this.initDataForMatTable(res, res.headers);
          },
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.creditProposalService
      .queryDynamicURL(
        {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sortData(),
        },
        dynamicURL
      )
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
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

  public showTimeLine(element: ICreditProposal): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(res2 => {});
    });
  }

  getText(value: any) {
    if (value === 'cp-status-approval') {
      this.title = 'Credit Proposal Approval';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'credit-proposal-status') {
      this.title = 'Credit Proposal';
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
  public kagebunshinNoJutsu() {
    if (this.isRm()) {
      if (this.parentPath === 'cp-status-approval') {
        if (this.account.authorities.length <= 2) {
          this.isRoleRM = false;
        } else {
          this.isRoleRM = true;
        }
      }
    }

    if (this.isBm()) {
      if (this.parentPath === 'cp-status-approval') {
        if (this.account.authorities.length <= 2) {
          this.isRoleRM = true;
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
}
