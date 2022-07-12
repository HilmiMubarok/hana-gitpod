import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IOrganizationManagement, OrganizationManagement } from './organization-management.model';
import { OrganizationManagementService } from './organization-management.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { PageService, FilterService, PageSettingsModel, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';

import { dataSource } from './datasource';

@Component({
  selector: 'jhi-organization-management',
  templateUrl: './organization-management.component.html',
  providers: [PageService, FilterService, ToolbarService, EditService],
})
export class OrganizationManagementComponent extends AbstractEntityComponent<IOrganizationManagement> {
  public items: IOrganizationManagement[] = [];
  public formatOptions = { type: 'dateTime', format: 'MM/dd/yyyy hh:mm:ss a' };

  service: any;
  activeModal: any;
  constructor(
    protected organizationManagementService: OrganizationManagementService,
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
      organizationManagementService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.parentRoute = '/organization-management';
    this.listChangeEventName = 'organizationManagementListModification';
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

  initialize() {
    this.organizationManagementService.loadCacheAll().subscribe((res: IOrganizationManagement[]) => (this.items = res || []));
  }

  deleteItem(id: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this OrganizationManagement?',
      accept: () => {
        this.organizationManagementService.delete(id).subscribe(() => {
          this.eventManager.broadcast({ name: 'organizationManagementListModification', content: 'Deleted an organizationManagement' });
          this.activeModal.close();
        });
      },
    });
  }

  public pageSettings: PageSettingsModel = { pageSize: 6, pageSizes: true };
}
