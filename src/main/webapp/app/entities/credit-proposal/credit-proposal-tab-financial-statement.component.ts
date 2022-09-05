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
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'jhi-credit-proposal-tab-financial-statement',
  templateUrl: './credit-proposal-tab-financial-statement.component.html',
  styleUrls: ['./credit-proposal-custom.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreditProposalTabFinancialStatementComponent {
  @ViewChild('spreadsheet')
  spreadsheetObj: SpreadsheetComponent;

  created() {
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:A9');
    this.spreadsheetObj.merge('B1:E1');
    // this.spreadsheetObj.merge('K4:M4');

    // this.spreadsheetObj.merge('K5:M6', 'Vertically');

    // this.spreadsheetObj.merge('N4:O6', 'Horizontally');
  }

  // public dataSource: object[] = [{
  //       'Deskripsi': 10001,
  //       'Employee Name': 'Davolio',
  //       '9:00 AM': 'Analysis Tasks',
  //       '9:30 AM': 'Analysis Tasks',
  //       '10:00 AM': 'Team Meeting',
  //       '10:30 AM': 'Testing',

  //   },
  //   {
  //       'Employee ID': 10002,
  //       'Employee Name': 'Buchanan',
  //       '9:00 AM': 'Task Assign',
  //       '9:30 AM': 'Support',
  //       '10:00 AM': 'Support',
  //       '10:30 AM': 'Support',

  //   },
  //   {
  //     'Employee ID': 10003,
  //     'Employee Name': 'Fuller',
  //     '9:00 AM': 'Check Mail',
  //     '9:30 AM': 'Check Mail',
  //     '10:00 AM': 'Check Mail',
  //     '10:30 AM': 'Analysis Tasks',

  // },
  //   ]
}
