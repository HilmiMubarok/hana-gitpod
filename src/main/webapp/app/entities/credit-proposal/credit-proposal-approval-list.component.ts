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
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';

@Component({
  selector: 'jhi-credit-proposal',
  templateUrl: './credit-proposal-approval-list.component.html',
  styleUrls: ['./credit-proposal.component.css'],
})
export class CreditProposalApprovalListComponent extends AbstractEntityComponent<ICreditProposal> {
  title = 'mydummy-data';
  public searchValue: string;
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

  search(searchValue) {
    console.log('this work');
  }
}
