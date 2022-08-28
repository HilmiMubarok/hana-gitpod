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
import { ICollateral } from '../collateral/collateral.model';

@Component({
  selector: 'jhi-credit-proposal-loan-facility-detail',
  templateUrl: './credit-proposal-loan-facility-detail.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalLoanFacilityDetailComponent implements OnInit {
  public items: ICreditProposal[];
  public itemsCollateral: any;

  constructor(private creditService: CreditProposalService) {}
  ngOnInit(): void {
    this.getCreditItems();
  }

  getCreditItems() {
    this.creditService.query().subscribe((res: HttpResponse<ICreditProposal[]>) => {
      this.items = res.body;
      for (let i = 0; i < res.body.length; i++) {
        console.log('ini lenght ', i);
      }
    });
  }

  printData() {
    console.log(this.items);
  }

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
  };
}
