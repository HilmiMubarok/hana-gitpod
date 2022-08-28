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

import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
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

@Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalComponent
  extends AbstractEntityEj2GridComponent<ISurveyAppraisals>
  implements AfterViewInit, AfterViewChecked
{
  @ViewChild('toolBar') public toolBar: ToolbarComponent;
  public statusCodes: any[];
  @ViewChild('triggerOverFlowCh') triggerOverFlowEl: ElementRef;
  public constantTriggerOverflow = true;

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
  public filterFields: Object = { text: 'filterText', value: 'id' };
  public filterPlaceholder = 'Select Filter';
  public box = 'Box';

  @ViewChild('searchTextBox') public searchTextBox: TextBoxComponent;

  public isRoleSU?: boolean;
  public isRoleRM?: boolean;

  constructor(
    protected surveyAppraisalsService: SurveyAppraisalsService,
    protected collateralAppraisalService: CollateralAppraisalService,
    protected collateralService: CollateralService,
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

  public loadAll(state: DataStateChangeEventArgs) {
    this.loading = true;

    this.page = state.skip === 0 ? 0 : state.skip / state.take;
    this.initialState = { skip: state.skip, take: state.take };

    if (this.currentSearch) {
      this.itemService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
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

  ngAfterViewInit() {
    this.collateralAppraisalService.find('status-code').subscribe((res: HttpResponse<any>) => {
      this.statusCodes = res.body;
    });
  }

  ngAfterViewChecked() {
    this.toolBar.refreshOverflow();
  }

  public onCreateSearchTextBox() {
    this.searchTextBox.addIcon('append', 'e-icons e-search');
  }

  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query = new Query();
    query = e.text !== '' ? query.where('filterText', 'contains', e.text, true) : query;
    e.updateData(this.filterData, query);
  };

  public onTagging(e: TaggingEventArgs) {
    console.log('e @onTagging : ', e);
  }

  public onRemoved(e: RemoveEventArgs) {
    console.log('e @onRemoved : ', e);
  }

  public goToEdit(): void {
    this.router.navigate(['./collateral-appraisal/new']);
  }

  public previousState(): void {
    window.history.back();
  }
}
