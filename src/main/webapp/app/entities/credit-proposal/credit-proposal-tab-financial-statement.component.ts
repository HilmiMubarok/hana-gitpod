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
import { AccordionComponent } from '@syncfusion/ej2-angular-navigations';
import { ColumnModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-credit-proposal',
  templateUrl: './credit-proposal-tab-financial-statement.component.html',
  styleUrls: ['./credit-proposal-custom.css'],
})
export class CreditProposalTabFinancialStatementComponent implements OnInit {
  public orderColumns: ColumnModel[];
  public shipColumns: ColumnModel[];

  ngOnInit(): void {
    this.orderColumns = [
      {
        headerText: 'Amount',
        width: 25,
        textAlign: 'Center',
        minWidth: 10,
      },
      {
        field: 'Freight',
        headerText: 'Margin',
        width: 25,
        textAlign: 'Center',
        minWidth: 10,
      },
    ];

    this.shipColumns = [
      {
        headerText: 'Amount',
        width: 25,
        textAlign: 'Center',
        minWidth: 10,
      },
      {
        headerText: 'Margin',
        width: 25,
        textAlign: 'Center',
        minWidth: 10,
      },
    ];
  }
  public data = [{ deskripsi: 'deskripsi', da: '2' }];
}
