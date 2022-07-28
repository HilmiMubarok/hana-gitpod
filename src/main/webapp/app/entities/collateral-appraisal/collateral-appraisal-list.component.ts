import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { CollateralService } from '../collateral/collateral.service';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalListComponent extends AbstractEntityEj2GridComponent<ICollateralAppraisal> implements OnInit {
  public data: any[];
  @ViewChild('template') template: DialogComponent;
  @Input() cif: string;
  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;
  constructor(
    protected colaterralService: CollateralService,
    protected colateralAppraisalService: CollateralAppraisalService,
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

    this.width = '90%';
    this.height = '90%';
    this.dialogVisible = false;
    this.animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

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
  faEye = faEye;
  get creditProposals() {
    return this.items['result'];
  }

  set creditProposals(creditProposal: ICollateralAppraisal[]) {
    this.items['result'] = creditProposal;
  }

  ngOnInit() {
    this.creditProposalService.find('cif/' + this.cif).subscribe(response => (this.data = response.body[0].collaterals));
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public detailClick(): void {
    this.dialogVisible = true;
  }
}
