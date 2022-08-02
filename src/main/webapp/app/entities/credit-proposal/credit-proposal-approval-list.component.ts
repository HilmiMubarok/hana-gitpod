import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-credit-proposal',
  templateUrl: './credit-proposal-approval-list.component.html',
  styleUrls: ['./credit-proposal.component.css'],
})
export class CreditProposalApprovalListComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  title = 'mydummy-data';
  public data: object[] = [
    {
      noId: '1',
      creditId: 'CP-1205202201',
      proposalDate: '12/05/2022',
      debtorNameId: 'KRISNA RN',
      customerTypeId: 'New',
      proposalTypeId: 'Back To Back',
      locationId: 'Surabaya',
      nikId: '35772172722',
      picId: 'Surya Credit Reviewer',
      submitDate: '08/07/2022',
      maturityDate: '22/07/2022',
      agingId: '3 days 4 hour',
    },
    {
      noId: '2',
      creditId: 'CP-1205202203',
      proposalDate: '06/05/2022',
      debtorNameId: 'DHANI',
      customerTypeId: 'Existing',
      proposalTypeId: '>15',
      locationId: 'Surabaya',
      nikId: '35772172722',
      picId: 'Surya Credit Reviewer',
      submitDate: '08/07/2022',
      maturityDate: '26/07/2022',
      agingId: '2 days 4 hour',
    },
    {
      noId: '3',
      creditId: 'CP-1205202205',
      proposalDate: '08/05/2022',
      debtorNameId: 'AHMAD',
      customerTypeId: 'Existing',
      proposalTypeId: '>15',
      locationId: 'Surabaya',
      nikId: '35772172722',
      picId: 'Surya Credit Reviewer',
      submitDate: '08/07/2022',
      maturityDate: '30/07/2022',
      agingId: '4 days 4 hour',
    },
  ];

  @ViewChild('findCifDialog')
  public findCifDialog: DialogComponent;

  public cifNumber: string;
  public visiblePrompt: Boolean = false;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };

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

    this.parentRoute = '/credit-proposal';
    this.listChangeEventName = 'creditProposalListModification';
    this.entityKeyName = 'id';

    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = false;
      this.predicate = 'createdDate';
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

  set creditProposals(creditProposal: ICreditProposal[]) {
    this.items['result'] = creditProposal;
  }

  public openPromptFindCIF(): void {
    this.findCifDialog.show();
  }

  public hidePromptFindCIF(): void {
    this.findCifDialog.hide();
  }

  public buttonFindCifDialog = [
    {
      click: this.hidePromptFindCIF.bind(this),
      buttonModel: {
        content: 'Close',
      },
    },
  ];

  public findCif(): void {
    this.creditProposalService.findByCif(this.cifNumber).subscribe((res: HttpResponse<ICreditProposal>) => {
      const result: ICreditProposal = res.body;
      if (result) {
        const redirectUri = '/credit-proposal/' + result[0].id + '/edit';
        this.router.navigate([redirectUri]);
      }
    });
  }
}
