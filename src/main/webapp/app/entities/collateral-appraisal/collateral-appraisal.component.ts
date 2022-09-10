import { Component, ViewChild, AfterViewInit, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';

import { Account } from 'app/core/auth/account.model';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import { ISurveyAppraisals, SurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';
import { PersonService } from '../person/person.service';
import { IPerson, Person } from '../person/person.model';
import { PartyGroupService } from '../party-group/party-group.service';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { CollateralService } from '../collateral/collateral.service';
import { ICollateral, Collateral } from '../collateral/collateral.model';

import { FilteringEventArgs, RemoveEventArgs, TaggingEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2-base';
import { ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';

import { DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { map } from 'rxjs/operators';

import { Observable, of } from 'rxjs';
import { GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalComponent
  extends AbstractEntityEj2GridComponent<ISurveyAppraisals>
  implements AfterViewInit, AfterViewChecked
{
  @ViewChild('triggerOverFlowCh') triggerOverFlowEl: ElementRef;
  public constantTriggerOverflow = true;

  @ViewChild('searchTextBox') public searchTextBox: TextBoxComponent;

  @ViewChild('Grid') grid: GridComponent;

  @ViewChild('toolBar') public toolBar: ToolbarComponent;
  public statusCodes: any[];
  public statusCodesData: any[];
  public statusCodesDataAllCount = [];
  public collateralAppraisalStatusCodes = [
    'DRAFT',
    'RETURN TO RM',
    'ASSIGNMENT',
    'RETURN TO ADMIN',
    'ASSIGNED',
    'VISITED',
    'REPORTED',
    'RETURN TO OFFICER',
    'APPROVAL',
    'APPEAL',
    'APPROVE',
  ];
  public collateralAppraisalRolesAccess = [
    {
      role: 'ROLE_ADMIN',
      isAuthorized: false,
    },
    {
      role: 'ROLE_RM',
      isAuthorized: false,
    },
    {
      role: 'ROLE_ADMIN_APPRAISER',
      isAuthorized: false,
    },
    {
      role: 'ROLE_SURVEYOR',
      isAuthorized: false,
    },
  ];

  /* public filterData: { [key: string]: Object }[] = [
    { id: 'f1', filterText: 'Jakarta' },
    { id: 'f2', filterText: 'Bandung' },
    { id: 'f3', filterText: 'Yogyakarta' },
    { id: 'f4', filterText: 'Semarang' },
    { id: 'f5', filterText: 'Surabaya' },
    { id: 'f6', filterText: 'Medan' },
    { id: 'f7', filterText: 'Palembang' },
    { id: 'f8', filterText: 'Pekan Baru' },
    { id: 'f9', filterText: 'Bandar Lampung' },
    { id: 'f10', filterText: 'Denpasar' },
  ]; */
  public filterData: { [key: string]: Object }[] = [];
  // public filterData: Observable<any>;
  public filterFields: Object = { text: 'filterText', value: 'id' };
  public filterPlaceholder = 'Select Filter';
  public globalSearchVal: string;
  public box = 'Box';
  private clickedChip: object;
  public jenisPinjaman = [
    {
      id: 'jpRenewal',
      label: 'Renewal',
    },
    {
      id: 'jpNew',
      label: 'New',
    },
    {
      id: 'jpAdditional',
      label: 'Additional',
    },
    {
      id: 'jpProgress',
      label: 'Progress',
    },
    {
      id: 'jpOther',
      label: 'Other',
    },
    {
      id: 'jpReappraisal',
      label: 'Re-Appraisal',
    },
  ];

  constructor(
    protected surveyAppraisalsService: SurveyAppraisalsService,
    protected collateralAppraisalService: CollateralAppraisalService,
    protected collateralService: CollateralService,
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
      surveyAppraisalsService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.parentRoute = '/collateral-appraisal';
    this.listChangeEventName = 'collateralAppraisalListModification';
    this.entityKeyName = 'id';
    this.clickedChip = { id: null };

    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = false;
      this.predicate = data.pagingParams.predicate;
      activatedRoute.queryParams.subscribe(params => {
        this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
        this.first = (this.page - 1) * this.itemsPerPage || 0;
      });
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  private loadByStatus(state: DataStateChangeEventArgs, status: string): void {
    this.page = state.skip === 0 ? 0 : state.skip / state.take;
    this.initialState = { skip: state.skip, take: state.take };

    const predicate = {
      page: this.page,
      size: state.take,
      sort: ['id,desc'],
      idStatus: status,
    };

    this.itemService
      .queryFilterBy(predicate)
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<ISurveyAppraisals[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  public chipEvent(ev: object): void {
    if (this.clickedChip['id'] !== ev['id']) {
      this.loadByStatus(this.initialState, ev['id']);
    } else {
      this.loadAll(this.initialState);
    }
    this.clickedChip = ev;
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    if (this.clickedChip) {
      this.loadByStatus(state, this.clickedChip['id']);
    } else {
      this.loadAll(this.initialState);
    }
  }

  public onSelectTown(args: any): void {
    console.log('args @onSelectTown : ', args);
    this.doSearch(args);
  }

  public doSearch(args: any): void {
    if (this.currentSearch) {
      this.router.navigate(['collateral-appraisal'], { queryParams: { search: this.currentSearch } });
      this.loadAll(this.initialState);
    } else {
      if (args) {
        const searchVal = '*' + args.value + '*';
        this.globalSearchVal = searchVal;
        this.router.navigate(['collateral-appraisal'], { queryParams: { search: searchVal } });
        this.loadAll(this.initialState);
      } else {
        this.router.navigate(['collateral-appraisal']);
        this.loadAll(this.initialState);
      }
    }
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
        .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ISurveyAppraisals[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
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
        .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ISurveyAppraisals[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
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
        next: (res: HttpResponse<ISurveyAppraisals[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  protected paginateEjGridItems(data: ISurveyAppraisals[], headers: HttpHeaders, state: DataStateChangeEventArgs) {
    const passData = {
      result: [],
      count: 0,
    };
    let passJp = '';

    this.loading = false;
    this.pageSettings.pageSize = parseInt(headers.get('X-Total-Count'), 10);

    for (let i = 0; i < data.length; i++) {
      passJp = '';
      data[i]['indexNum'] = this.page === 0 ? i + 1 : this.page * state.take + (i + 1);

      for (const [key, value] of Object.entries(data[i])) {
        if (Object.prototype.hasOwnProperty.call(data[i], key)) {
          for (let j = 0; j < this.jenisPinjaman.length; j++) {
            if (key === this.jenisPinjaman[j].id) {
              passJp = data[i][key] === true ? passJp + this.jenisPinjaman[j].label + ', ' : passJp;
            }
          }
        }
      }
      data[i]['jP'] = passJp;
    }

    passData.result = data;
    passData.count = parseInt(headers.get('X-Total-Count'), 10);
    this.items = of(passData);
  }

  ngAfterViewInit() {
    this.collateralAppraisalService.find('status-code').subscribe((res: HttpResponse<any>) => {
      this.statusCodes = res.body;
      this.setRoleAccountAuthorized();
      this.initializeCountStatusCode();
      this.setStatusCodes();
      this.setStatusCount();
      console.log('this.statusCodesData @getStatusCount : ', this.statusCodesData);
    });

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

  ngAfterViewChecked() {
    this.toolBar.refreshOverflow();
  }

  public onCreateSearchTextBox() {
    this.searchTextBox.addIcon('append', 'e-icons e-search');
  }

  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    // let query = new Query();
    /* query = e.text !== '' ? query.where('filterText', 'contains', e.text, true) : query;
    e.updateData(this.filterData, query); */
  };

  public onTagging(e: TaggingEventArgs) {
    console.log('e @onTagging : ', e);
  }

  public onRemoved(e: RemoveEventArgs) {
    console.log('e @onRemoved : ', e);
  }

  private setRoleAccountAuthorized(): void {
    for (let i = 0; i < this.currentAccount.authorities.length; i++) {
      for (let j = 0; j < this.collateralAppraisalRolesAccess.length; j++) {
        if (this.currentAccount.authorities[i] === this.collateralAppraisalRolesAccess[j].role) {
          this.collateralAppraisalRolesAccess[j].isAuthorized = true;
        }
      }
    }
  }

  private setStatusCodes(): void {
    this.sortStatus();
    for (let i = 0; i < this.collateralAppraisalRolesAccess.length; i++) {
      if (
        (this.collateralAppraisalRolesAccess[i].role === 'ROLE_ADMIN' && this.collateralAppraisalRolesAccess[i].isAuthorized === true) ||
        (this.collateralAppraisalRolesAccess[i].role === 'ROLE_RM' && this.collateralAppraisalRolesAccess[i].isAuthorized === true)
      ) {
        break;
      } else if (
        this.collateralAppraisalRolesAccess[i].role === 'ROLE_ADMIN_APPRAISER' &&
        this.collateralAppraisalRolesAccess[i].isAuthorized === true
      ) {
        this.filterStatus(this.collateralAppraisalRolesAccess[i].role);
        break;
      } else if (
        this.collateralAppraisalRolesAccess[i].role === 'ROLE_SURVEYOR' &&
        this.collateralAppraisalRolesAccess[i].isAuthorized === true
      ) {
        this.filterStatus(this.collateralAppraisalRolesAccess[i].role);
        break;
      }
    }
  }

  private filterStatus(role: string): void {
    this.spliceStatus('DRAFT');
    if (role === 'ROLE_SURVEYOR') {
      this.spliceStatus('ASSIGNMENT');
    }
  }

  private spliceStatus(status: string): void {
    for (let j = 0; j < this.statusCodesData.length; j++) {
      if (this.statusCodesData[j].label === status) {
        this.statusCodesData.splice(j, 1);
      }
    }
  }

  private async getStatusCount(): Promise<void> {
    for (let i = 0; i < this.statusCodesData.length; i++) {
      await new Promise<void>(resolve => {
        this.collateralAppraisalService.customGet('count-status/' + this.statusCodesData[i].id).subscribe((res: HttpResponse<any>) => {
          this.statusCodesData[i].count = res.body;
          resolve();
        });
      });
    }
  }

  /* private getStatusCount(): void {
	for(let i = 0; i < this.statusCodesData.length; i++){
	  this.collateralAppraisalService.customGet('count-status/' + this.statusCodesData[i].id).subscribe((res: HttpResponse<any>) => {
		this.statusCodesData[i].count = res.body;
	  })
	}
  } */

  private setStatusCount(): void {
    console.log('this.statusCodesDataAllCount : ', this.statusCodesDataAllCount);
    console.log('this.statusCodesData : ', this.statusCodesData);
  }

  private initializeCountStatusCode(): void {
    this.statusCodesData = this.statusCodes.filter(({ label }) => this.collateralAppraisalStatusCodes.some(e => label === e));

    for (let i = 0; i < this.statusCodesData.length; i++) {
      this.statusCodesData[i].count = 0;
    }

    this.getCountAllStatus();
  }

  private sortStatus(): void {
    const tempStatusCodesData = [];
    for (let j = 0; j < this.collateralAppraisalStatusCodes.length; j++) {
      for (let i = 0; i < this.statusCodesData.length; i++) {
        if (this.collateralAppraisalStatusCodes[j] === this.statusCodesData[i].label) {
          tempStatusCodesData.push(this.statusCodesData[i]);
        }
      }
    }
    this.statusCodesData = tempStatusCodesData;
  }

  private async getCountAllStatus(): Promise<void> {
    for (let i = 0; i < this.statusCodesData.length; i++) {
      await new Promise<void>(resolve => {
        this.collateralAppraisalService.customGet('count-status/' + this.statusCodesData[i].id).subscribe((res: HttpResponse<any>) => {
          const passObj = {};
          passObj['id'] = this.statusCodesData[i].id;
          passObj['label'] = this.statusCodesData[i].label;
          passObj['count'] = res.body;
          this.statusCodesDataAllCount.push(passObj);
          resolve();
        });
      });
    }
  }

  public dataBound(args: any) {
    // this.grid.autoFitColumns(["Name"]); // autoFit particular column
    // this.grid.autoFitColumns(); // autofit all the columns
  }

  public goToEdit(): void {
    this.router.navigate(['./collateral-appraisal/new']);
  }

  public previousState(): void {
    window.history.back();
  }
}
