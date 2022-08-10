import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IEmployee } from './employee.model';
import { EmployeeService } from './employee.service';
import { IEmployee as IEmployeeStrapi, Employee as EmployeeStrapi } from '../../shared/integration/models/employees-page.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { StrapiService } from 'app/shared/integration/strapi.service';
import { HttpResponse } from '@angular/common/http';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { Button, IButton } from 'app/shared/integration/models/button.model';

@Component({
  selector: 'jhi-employee',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent extends AbstractEntityEj2GridComponent<IEmployee> {
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  public label: IEmployeeStrapi;
  public button: IButton;

  constructor(
    protected employeeService: EmployeeService,
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
    protected reportUtils: ReportUtilService,
    private strapiService: StrapiService
  ) {
    super(
      employeeService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.label = new EmployeeStrapi();
    this.button = new Button();

    this.parentRoute = '/employee';
    this.listChangeEventName = 'employeeListModification';
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

  protected initialize(): void {
    this.strapiService.getEmployees({ pageAt: 'index' }).subscribe((res: HttpResponse<IEmployeeStrapi[]>) => {
      if (res.body.length > 0) {
        this.label = res.body[0];
      }
    });

    this.strapiService.getButton().subscribe((res: HttpResponse<IButton>) => {
      if (res.body) {
        this.button = res.body;
      }
    });
  }

  trackId(index: number, item: IEmployee) {
    return item.id;
  }
}
