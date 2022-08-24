import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
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
import { ColumnModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-credit-proposal-tab-repayment-capability',
  templateUrl: './credit-proposal-tab-repayment-capability.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabRepaymentCapabilityComponent {
  public pageSettings: PageSettingsModel = { pageCount: 2, pageSize: 5 };
  public state: string;
  public dialogVisible: false;
  public data: any = [
    {
      descriptionFS: 'Monthly Sales (EBIT)',
      valueFS: '768.8',
      descriptionAverage: 'Average Balance ',
      valueAverage: '1.451.8',
      descriptionCreditMutation: 'Credit Mutation',
      valueCreditMutation: '3.627,8',
    },
  ];
  public fsColumns: ColumnModel[] = [
    {
      field: 'descriptionFS',
      headerText: 'Description',
      width: 120,
      headerTextAlign: 'Center',
      textAlign: 'Left',
      minWidth: 10,
    },
    {
      field: 'valueFS',
      headerText: 'Value',
      width: 100,
      headerTextAlign: 'Center',
      textAlign: 'Right',
      minWidth: 10,
    },
  ];

  public averagebalanceColumns: ColumnModel[] = [
    {
      field: 'descriptionAverage',
      headerText: 'Description',
      width: 100,
      minWidth: 10,
      headerTextAlign: 'Center',
      textAlign: 'Left',
    },
    {
      field: 'valueAverage',
      headerText: 'Value',
      width: 120,
      minWidth: 10,
      headerTextAlign: 'Center',
      textAlign: 'Right',
    },
  ];
  public creditmutationlumns: ColumnModel[] = [
    {
      field: 'descriptionCreditMutation',
      headerText: 'Description',
      width: 100,
      minWidth: 10,
      headerTextAlign: 'Center',
      textAlign: 'Left',
    },
    {
      field: 'valueCreditMutation',
      headerText: 'Value',
      width: 120,
      minWidth: 10,
      headerTextAlign: 'Center',
      textAlign: 'Right',
    },
  ];
}
