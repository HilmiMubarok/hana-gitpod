import { Component, ViewChild } from '@angular/core';
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
import { ItemModel, OpenCloseMenuEventArgs, DropDownButtonComponent } from '@syncfusion/ej2-angular-splitbuttons';

@Component({
  selector: 'jhi-collateral-appraisal-process',
  templateUrl: './collateral-appraisal-process.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalProcessComponent extends AbstractEntityComponent<ICollateralAppraisal> {
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

  public BlodType: string[] = ['Objek Jaminan', '.........'];
  @ViewChild('dropdownbutton')
  public dropdownbutton: DropDownButtonComponent;
  public data: ItemModel[] = [
    {
      text: 'Rincian',
    },
    {
      text: 'Hapus',
    },
  ];

  public onOpen(args: OpenCloseMenuEventArgs) {
    args.element.parentElement.style.top =
      this.dropdownbutton.element.getBoundingClientRect().top - args.element.parentElement.offsetHeight + 'px';
  }
}
