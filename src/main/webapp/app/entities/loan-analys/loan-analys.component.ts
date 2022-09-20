import { Component, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
// import { EmitType } from '@syncfusion/ej2-base';
// import { FilteringEventArgs, RemoveEventArgs, TaggingEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { map } from 'rxjs/operators';

@Component({
  selector: 'jhi-loan-analys',
  templateUrl: './loan-analys.component.html',
  styleUrls: ['./loan-analys.css']
})
export class LoanAnalysComponent
  extends AbstractEntityEj2GridComponent<ICreditProposal>
  implements AfterViewInit, AfterViewChecked
{
  @ViewChild('toolBar') public toolBar: ToolbarComponent;
  @ViewChild('searchTextBox') public searchTextBox: TextBoxComponent;
  @ViewChild('grid') public grid: GridComponent;
  public filterData: { [key: string]: Object }[] = [];
  public filterFields: Object = { text: 'filterText', value: 'id' };
  public filterPlaceholder = 'Select Filter';
  public box = 'Box';

  public statusCodesData: any[] = [];
  public creditProposalStatusCodes = [
    'DRAFT',
    'RETURN TO CREDIT PROPOSAL (BU)',
    'APPROVAL SME HEAD',
    'APPROVAL BM',
    'APPROVAL SDH',
    'APPROVAL DIV HEAD',
    'CANCEL',
    'REJECT',
    'COMPLETE',
  ];

  public globalSearchVal: string;
  public globalSearchValModel: string;
  public clickedChip: string;

  constructor(
    protected creditProposalService: CreditProposalService,
    protected stateBoundaryService: StateBoundaryService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected modalService: NgbModal,
    protected confirmationService: ConfirmationService
  ) {
    super(
      creditProposalService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );
    this.entityKeyName = 'id';
    this.predicate = 'id';
    this.clickedChip = null;
  }

  ngAfterViewChecked() {
    this.toolBar.refreshOverflow();
  }

  ngAfterViewInit() {
    for (let i = 0; i < this.creditProposalStatusCodes.length; i++) {
      const passObj = {};
      passObj['id'] = i;
      passObj['label'] = this.creditProposalStatusCodes[i];
      passObj['count'] = 0;
      this.statusCodesData.push(passObj);
    }

    this.stateBoundaryService
      .queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['city'], size: 9999 })
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

  public chipEvent(ev: object): void {
    if (this.clickedChip !== ev['id']) {
      const status = ev['label'];
      this.loadAllByStatus(this.initialState, status);
    } else {
      this.loadAll(this.initialState);
    }
    this.clickedChip = ev['id'];
  }

  public doSearch(): void {
    if (this.currentSearch) {
      this.router.navigate(['loan-analys'], { queryParams: { search: this.currentSearch } });
      this.loadAll(this.initialState);
    }
  }

  public loadAllByStatus(state: DataStateChangeEventArgs, status: string) {
    let _status: string;
    _status = '';
    if (status === 'DRAFT') {
      _status = status;
    } else {
      _status = 'CP_' + status.replace(/ /g, '_');
    }
    this.itemService
      .queryFilterBy({
        page: this.page,
        idStatus: _status,
        size: state.take,
        sort: ['id', 'desc'],
      })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
    return;
  }

  public loadAll(state: DataStateChangeEventArgs) {
    this.loading = true;

    this.page = state.skip === 0 ? 0 : state.skip / state.take;
    this.initialState = { skip: state.skip, take: state.take };

    if (this.currentSearch) {
      this.itemService
        .search({
          page: this.page,
          query: this.currentSearch,
          size: state.take,
          sort: ['id,desc'],
        })
        .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ICreditProposal[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    if (this.globalSearchVal) {
      this.itemService
        .search({
          page: this.page,
          query: this.globalSearchVal,
          size: state.take,
          sort: ['id,desc'],
        })
        .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ICreditProposal[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.itemService
      .query({
        page: this.page,
        size: state.take,
        sort: ['id,desc'],
      })
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  public onCreateSearchTextBox() {
    this.searchTextBox.addIcon('append', 'e-icons e-search');
  }

  public dataBound(args: any) {
    this.grid.autoFitColumns(); // autofit all the columns
  }

  public previousState(): void {
    window.history.back();
  }

  public popUpSingleAssign(data: any): void {
	console.log('data @popUpSingleAssign : ', data);
  }

  public goToBulkBatchAssign(): void {
    this.router.navigate(['./loan-analys/batch-bulk-assign']);
  }
}