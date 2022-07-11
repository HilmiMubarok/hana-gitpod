import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IOrganizationFinancial } from './organization-financial.model';
import { OrganizationFinancialService } from './organization-financial.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { IDataOptions, PivotView, CellEditSettings, BeginDrillThroughEventArgs } from '@syncfusion/ej2-angular-pivotview';
import { Grid, Sort, Filter, Group } from '@syncfusion/ej2-grids';
import { data1 } from './datasource';

// import { Pivot_Data } from './datasource.ts';
@Component({
  selector: 'jhi-organization-financial',
  templateUrl: './organization-financial.component.html',
  styleUrls: ['../../../content/scss/vendor.scss', './organization.css'],
})
export class OrganizationFinancialComponent extends AbstractEntityComponent<IOrganizationFinancial> {
  constructor(
    protected organizationFinancialService: OrganizationFinancialService,
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
      organizationFinancialService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.parentRoute = '/organization-financial';
    this.listChangeEventName = 'organizationFinancialListModification';
    this.entityKeyName = 'id';

    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      activatedRoute.queryParams.subscribe(params => {
        this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
        this.first = (this.page - 1) * this.itemsPerPage || 0;
      });
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  trackId(index: number, item: IOrganizationFinancial) {
    return item.id;
  }

  public data1: object[] = data1;

  get organizationFinancials() {
    return this.data1;
  }

  set organizationFinancials(organizationFinancial: IOrganizationFinancial[]) {
    this.items = organizationFinancial;
  }

  // ngOnInit(): void {
  //   this.data1 = data1;
  // }
  public BlodType: string[] = ['A', 'AB', '0', 'B'];
  public path: Object = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
  };
  public onUploadSuccess(args: any): void {
    if (args.operation === 'upload') {
      console.log('File uploaded successfully');
    }
  }
  public onUploadFailure(args: any): void {
    console.log('File failed to upload');
  }
}
