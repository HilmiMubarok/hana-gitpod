import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CreditProposalService } from './credit-proposal.service';

import { ConfirmationService, MessageService } from 'primeng/api';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { CollateralService } from '../collateral/collateral.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationViewComponent implements OnInit {
  constructor(
    protected creditProposalService: CreditProposalService,
    protected collateralService: CollateralService,

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
  ) {}

  public dataCreditProposal: ICreditProposal = new CreditProposal();
  public gridCreditProposal: any = [];

  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
    // 'Image', 'FileManager']
  };

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.creditProposalService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICreditProposal>) => {
      this.dataCreditProposal = res.body;
      this.gridCreditProposal.push(res.body);
      this.gridCreditProposal[0].addressPrimary = res.body.addresses[0].address.address1;
    });
  }
}
