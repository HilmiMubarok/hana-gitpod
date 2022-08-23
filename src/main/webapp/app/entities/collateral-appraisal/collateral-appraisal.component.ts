import { Component, ViewChild, OnInit, TemplateRef, ViewContainerRef, Inject, AfterViewInit } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { IStateBoundary, StateBoundary } from '../state-boundary/state-boundary.model';
import { CifCollateralAppraisalService } from '../cif-collateral-appraisal/cif-collateral-appraisal.service';
import { ICifCollateralAppraisal, CifCollateralAppraisal } from '../cif-collateral-appraisal/cif-collateral-appraisal.model';

import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FilteringEventArgs, RemoveEventArgs, TaggingEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2-base';

import { DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { map } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalComponent extends AbstractEntityEj2GridComponent<ICifCollateralAppraisal> implements OnInit, AfterViewInit {
  @ViewChild('childtemplateStatus', { static: true }) public childtemplateStatus: TemplateRef<{}>;
  @ViewChild('childtemplateAction', { static: true }) public childtemplateAction: TemplateRef<{}>;
  public childGrid: any;
  public cities: IStateBoundary[];

  public filterData: { [key: string]: Object }[] = [
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
  ];
  // public filterData: { [key: string]: Object; }[];
  public filterFields: Object = { text: 'filterText', value: 'id' };
  public filterPlaceholder = 'Select Filter';
  public box = 'Box';
  public isRoleSU?: boolean;
  public isRoleRM?: boolean;

  /* public searchDate = false;
  public today: Date = new Date(new Date().toDateString());
  public weekStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 7) % 7)).toDateString());
  public weekEnd: Date = new Date(new Date(new Date().setDate(new Date(new Date().setDate((new Date().getDate() - (new Date().getDay() + 7) % 7))).getDate() + 6)).toDateString());
  public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  public monthEnd: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)).toDateString());
  public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
  public lastEnd: Date = new Date(new Date(new Date().setDate(0)).toDateString());
  public yearStart: Date = new Date(new Date(new Date().getFullYear() - 1, 0, 1).toDateString());
  public yearEnd: Date = new Date(new Date(new Date().getFullYear() - 1, 11, 31).toDateString());*/

  constructor(
    protected cifCollateralAppraisalService: CifCollateralAppraisalService,
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
    protected confirmationService: ConfirmationService,
    @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef
  ) {
    super(
      cifCollateralAppraisalService,
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
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  ngOnInit(): void {
    this.childGrid = {
      dataSource: [],
      queryString: 'partyId',
      editSettings: { template: this.childtemplateStatus, template1: this.childtemplateAction },
      load() {
        this.registeredTemplate = {};
      },
      class: 'border',
      columns: [
        { field: 'id', headerText: 'No', textAlign: 'Right', width: 120 },
        { field: 'applicationId', headerText: 'No Request', width: 120 },
        { field: 'apprDate', headerText: 'Tanggal Request', width: 120 },
        { field: 'branch', headerText: 'Tipe Collateral', width: 120 },
        { field: 'collateralId', headerText: 'Kota', width: 120 },
        { field: 'apprOfficer', headerText: 'Tipe Officer Appraisal', width: 120 },
        { template: this.childtemplateStatus, headerText: 'Status', width: 150 },
        { template: this.childtemplateAction, headerText: 'Action', width: 150 },
      ],
    };

    /* this.childGrid = {
      dataSource: [],
      queryString: 'partyId',
      editSettings: { template: this.childtemplateStatus },
      load() {
        this.registeredTemplate = {};
      },
      class: 'border',
      columns: [
        { field: 'id', headerText: 'No', textAlign: 'Right', width: 120 },
        { field: 'applicationId', headerText: 'No Request', width: 120 },
        { field: 'apprDate', headerText: 'Tanggal Request', width: 120 },
        { field: 'branch', headerText: 'Tipe Collateral', width: 120 },
    { field: 'collateralId', headerText: 'Kota', width: 120 },
    { field: 'apprOfficer', headerText: 'Tipe Officer Appraisal', width: 120 },
        { field: 'statusDescription', headerText: 'Status', width: 120 },
      ],
    };*/

    this.eventSubscriber = this.eventManager.subscribe(this.listChangeEventName, () => this.loadAll(this.initialState));
    this.loadAll(this.initialState);
    // this.initializeCity();

    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
      this.initializeRole();
    });
  }

  private initializeRole(): void {
    this.isRoleSU = false;
    this.isRoleRM = false;

    for (let i = 0; i < this.currentAccount['authorities'].length; i++) {
      if (this.currentAccount['authorities'][i] === 'ROLE_RM') {
        this.isRoleRM = true;
      }
    }

    for (let i = 0; i < this.currentAccount['authorities'].length; i++) {
      if (this.currentAccount['authorities'][i] === 'ROLE_ADMIN') {
        this.isRoleSU = true;
      }
    }

    this.isRoleRM = this.isRoleSU ? true : false;
  }

  public paginateEjGridItems(data: any[], headers: HttpHeaders, state: DataStateChangeEventArgs) {
    const passData = {
      result: [],
      count: 0,
    };

    let countResultDataChilds = 0;

    this.loading = false;
    this.pageSettings.pageSize = parseInt(headers.get('X-Total-Count'), 10);

    for (let i = 0; i < data.length; i++) {
      data[i]['partyId'] = data[i]['cif']['partyId'];
      // Bug Ej2 Hierarychical Grid -- Start -- Explanation : It should be only the child data is read (for routing) but the parent must have too & 1 of the data must have value
      data[i]['customerId'] = data[i]['cif']['customerId'];
      data[i]['customerType'] = data[i]['cif']['customerType'];
      // Bug Ej2 Hierarychical Grid -- Start -- Explanation : It should be only the child data is read (for routing) but the parent must have too & 1 of the data must have value
      if (this.page === 0) {
        data[i]['indexNum'] = i + 1;
      } else {
        data[i]['indexNum'] = this.page * state.take + (i + 1);
      }
    }

    passData.result = data;
    passData.count = parseInt(headers.get('X-Total-Count'), 10);
    this.items = of(passData);

    this.childGrid.dataSource = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i]['collateralAppraisals'].length; j++) {
        this.childGrid.dataSource.push(data[i]['collateralAppraisals'][j]);
        // Hardcode to Test -- Start
        // this.childGrid.dataSource[j]['customerId'] = data[i]['cif']['customerId'];
        // this.childGrid.dataSource[j]['customerType'] = 'PERSONAL';
        // Hardcode to Test -- End
        this.childGrid.dataSource[this.childGrid.dataSource.length - 1]['customerId'] = data[i]['cif']['customerId'];
        this.childGrid.dataSource[this.childGrid.dataSource.length - 1]['customerType'] = data[i]['cif']['customerType'];
        countResultDataChilds = countResultDataChilds + 1;
      }
    }

    console.log('parent data : ', passData.result);
    console.log('child data : ', this.childGrid.dataSource);
  }

  ngAfterViewInit() {
    this.childtemplateStatus.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplateStatus.elementRef.nativeElement.propName = 'template';

    this.childtemplateAction.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplateAction.elementRef.nativeElement.propName = 'template1';
  }

  /* public loadAll(state: DataStateChangeEventArgs) {
    this.loading = true;

    this.page = state.skip === 0 ? 0 : state.skip / state.take;
    this.initialState = { skip: state.skip, take: state.take };

    if (this.currentSearch) {
      this.itemService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage
        })
        .pipe(map((res: HttpResponse<ICifCollateralAppraisal[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ICifCollateralAppraisal[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.itemService
      .query({
        page: this.page,
        size: state.take
      })
      .subscribe({
        next: (res: HttpResponse<ICifCollateralAppraisal[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  private initializeCity(): void {
    this.stateBoundaryService
      .getAll()
      .subscribe(res => {
    this.cities = res.body;
    this.filterData = res.body;
      });
  }*/

  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    // let query = new Query();
    // query = e.text !== '' ? query.where('filterText', 'contains', e.text, true) : query;
    // e.updateData(this.filterData, query);
  };

  public onTagging(e: TaggingEventArgs) {
    // this.searchDate = e.itemData['id'] === 'f6' ? true : false;
  }

  public onRemoved(e: RemoveEventArgs) {
    console.log('e @onRemoved : ', e);
    // this.searchDate = e.itemData['id'] === 'f6' ? false : true;
  }

  public goToEdit(): void {
    this.router.navigate(['./collateral-appraisal/new']);
  }

  faSearch = faSearch;

  index1 = '5 \n Draft';
  index2 = '4 \n Assignment';
  index3 = '7 \n Assigned';
  index4 = '2 \n Visited';
  index5 = '3 \n Reported';
}
