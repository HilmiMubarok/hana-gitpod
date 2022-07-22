import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { TextBox } from '@syncfusion/ej2-angular-inputs';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail',
  templateUrl: './collateral-appraisal-process-detail-mesin.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalDetailProcessBuildingConditionComponent extends AbstractEntityComponent<ICollateralAppraisal> {
  title = 'mydummy-data';
  public data: object[] = [
    {
      noId: '1',
      mesinId: 'Mesin CNC Vertical Machining Center 2017',
      tipedocId: '1VMC085XX06518',
      dateId: '19/02/2018',
      fromId: 'debitur',
      amountId: 'USD 287.000',
    },
    {
      noId: '2',
      mesinId: 'Mesin CNC Vertical Machining Center 2017',
      tipedocId: '1VMC085XX06518',
      dateId: '19/02/2018',
      fromId: 'debitur',
      amountId: 'USD 287.000',
    },
  ];
  constructor(
    protected collateralAppraisalService: CollateralAppraisalService,
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
      collateralAppraisalService,
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

  trackId(index: number, item: ICollateralAppraisal) {
    return item.id;
  }

  get collateralAppraisals() {
    return this.items;
  }

  set collateralAppraisals(collateralAppraisal: ICollateralAppraisal[]) {
    this.items = collateralAppraisal;
  }
}
