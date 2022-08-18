import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
@Component({
  selector: 'jhi-credit-proposal-list',
  templateUrl: './credit-proposal-list-component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalListComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  public data: object[];
  public toolbarOptions: ToolbarItems[];
  faSearch = faSearch;

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
  }

  ngOnInit(): void {
    this.toolbarOptions = ['Search'];
    this.getData();
  }

  getData(): void {
    this.creditProposalService.query().subscribe(response => (this.data = response.body));
  }

  detail(): void {
    this.router.navigate(['/credit-proposal/basic-information-1']);
  }
}
