import { Component, ViewChild, OnInit, TemplateRef, ViewContainerRef, Inject, AfterViewInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
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

import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { of } from 'rxjs';

@Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
  styleUrls: ['./collateral-appraisal-grid.css'],
})
export class CollateralAppraisalComponent extends AbstractEntityEj2GridComponent<ICifCollateralAppraisal> implements OnInit, AfterViewInit {
  @ViewChild('childtemplate', { static: true }) public childtemplate: TemplateRef<{}>;
  public childGrid: any;
  public openFilterStatus = false;

  constructor(
    private cifCollateralAppraisalService: CifCollateralAppraisalService,
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
    this.entityKeyName = '';
    // this.entityKeyName = 'id';

    // this.predicate = 'createdDate';
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = false;
      this.predicate = '';
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
      editSettings: { template: this.childtemplate },
      load() {
        this.registeredTemplate = {};
      },
      class: 'border',
      columns: [
        { field: 'id', headerText: 'No', textAlign: 'Right', width: 120 },
        { field: 'applicationId', headerText: 'No Request', width: 120 },
        { field: 'apprDate', headerText: 'Tanggal Request', width: 120 },
        { field: 'collateralId', headerText: 'Tipe Collateral', width: 120 },
        { field: 'statusDescription', headerText: 'Status', width: 120 },
        { template: this.childtemplate, headerText: 'Action', width: 150 },
      ],
    };

    this.eventSubscriber = this.eventManager.subscribe(this.listChangeEventName, () => this.loadAll(this.initialState));
    this.loadAll(this.initialState);

    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
  }

  ngAfterViewInit() {
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
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
      data[i]['number'] = data[i]['cif']['number'];
      data[i]['customerType'] = '';
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
        this.childGrid.dataSource[j]['number'] = data[i]['cif']['number'];
        this.childGrid.dataSource[j]['customerType'] = 'PERSON';
        // Hardcode to Test -- End
        // this.childGrid.dataSource[j]['customerType'] = data[i]['cif']['customerType'];
        countResultDataChilds = countResultDataChilds + 1;
      }
    }
  }

  public goToEdit(ev: any): void {
    this.router.navigate(['./collateral-appraisal/new']);
  }

  public openFilter(ev: any): void {
    this.openFilterStatus = !this.openFilterStatus;
  }
}
