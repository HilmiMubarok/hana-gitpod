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
  selector: 'jhi-credit-proposal-dialog-approval',
  templateUrl: './credit-proposal-dialog-approval.component.html',
})
export class CreditProposalDialogApprovalComponent {
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

  public data: any = [];

  ngOnInit(): void {
    this.data = data;
  }
}

export const data: any = [
  {
    No: 1,
    Criteria: 'BASIC INFORMATION',
    value: '1',
  },
  {
    No: 2,
    Criteria: 'BUSSINES ACTIVTY',
    value: '2',
  },
  {
    No: 3,
    Criteria: 'LOAN FACILITY DETAIL',
    value: '3',
  },
  {
    No: 4,
    Criteria: 'RISK ACCEPTANCE CRITERIA',
    value: '4',
  },
  {
    No: 5,
    Criteria: 'PROPOSE PRICING',
    value: '5',
  },
  {
    No: 6,
    Criteria: 'COLLATERAL INFO',
    value: '6',
  },
  {
    No: 7,
    Criteria: 'MANAGEMENT INFORMATION',
    value: '7',
  },
  {
    No: 8,
    Criteria: 'SLIK CECKING',
    value: '8',
  },
  {
    No: 9,
    Criteria: 'REPAYMENT CAPABILITY',
    value: '9',
  },
  {
    No: 10,
    Criteria: 'BANK ACCOUNT ANALYSYS',
    value: '10',
  },
  {
    No: 11,
    Criteria: 'COVENANT & DOCUMENT CHECKLIST',
    value: '11',
  },
  {
    No: 12,
    Criteria: 'EXPOSURE',
    value: '12',
  },
  {
    No: 13,
    Criteria: 'PERFORMA LAPORAN KEUANGAN',
    value: '13',
  },
  {
    No: 14,
    Criteria: 'CORESPONDENCE',
    value: '14',
  },
  {
    No: 15,
    Criteria: 'SUMMARY',
    value: '15',
  },
];
