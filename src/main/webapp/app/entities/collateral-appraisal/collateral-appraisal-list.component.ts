import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICollateralAppraisal } from './collateral-appraisal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { CollateralAppraisalService } from './collateral-appraisal.service';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./css/appraisal-component.css'],
})
export class CollateralAppraisalListComponent extends AbstractEntityEj2GridComponent<ICollateralAppraisal> {
  public data: any[];
  constructor(
    protected creditProposalService: CreditProposalService,
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

    this.data = [
      {
        no: 1,
        jenisDetailJamian: 'Pabrik',
        alamat: 'Industry Raya10D-8',
        kota: 'Surabaya',
        jenisObject: 'Baru',
        jenisPermohonan: 'Renewal',
        tipeOfficerApprisal: 'Internal',
      },
      {
        no: 2,
        jenisDetailJamian: 'Ruko',
        alamat: 'Industry Raya10D-9',
        kota: 'Surabaya',
        jenisObject: 'Baru',
        jenisPermohonan: 'ReAppraisal',
        tipeOfficerApprisal: 'Internal',
      },
    ];

    this.parentRoute = '/credit-proposal';
    this.listChangeEventName = 'creditProposalListModification';
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

  get creditProposals() {
    return this.items['result'];
  }

  set creditProposals(creditProposal: ICollateralAppraisal[]) {
    this.items['result'] = creditProposal;
  }
}
