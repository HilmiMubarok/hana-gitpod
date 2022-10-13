import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { CreditProposalProcessService } from './credit-proposal-process.service';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';
import {
  BASIC_SUBMENU_CREDITPROPOSAL,
  PROPOSAL_TYPE,
  SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
  SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
  SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
} from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-credit-proposal-basic',
  templateUrl: './proposal-basic-information-floating.component.html',
  styleUrls: ['./proposal-basic-information.css'],
})
export class ProposalBasicInformationComponent implements OnInit {
  private id: number;
  public clickedMenu: string;
  public tasks: IProcessTask[] = new Array<IProcessTask>();

  public creditProposal: ICreditProposal;

  public proposalType: object[];

  public subMenu: object[];
  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [];
  public menuItemsAll: MenuItemModel[] = [
    { text: 'BASIC INFORMATION' },
    { text: 'BUSINES ACTIVITY' },
    { text: 'LOAN FACILITY DETAIL' },
    { text: 'EXPOSURE' },
    { text: 'RISK ACCEPTENCE CRITERIA' },
    { text: 'COLLATERAL INFO' },
    { text: 'MANAGEMENT INFORMATION' },
    { text: 'SLIK CHECKING' },
    { text: 'FINANCIAL STATEMENT' },
    { text: 'BANK ACCOUNT ANALYSIS' },
    { text: 'TRADE CHECKING' },
    { text: 'CREDIT RATING' },
    { text: 'REPAYMENT CAPABILITY' },
    { text: 'CONVENANT & TBO' },
    { text: 'DOCUMENT CHECKLIST' },
    { text: 'PROPOSE PRICING' },
    { text: 'GROUP & GUARANTOUR ANALYSIS' },
    { text: 'SUMMARY' },
    // { text: 'CUSTOMER PROFITABILITY & CROSS SELLING FACTOR' },
  ];

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected messageService: MessageService,
    public dialog: MatDialog,
    protected reportUtils: ReportUtilService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.subMenu = BASIC_SUBMENU_CREDITPROPOSAL;
    this.proposalType = PROPOSAL_TYPE;
  }

  public subMenuItems = '';

  ngOnInit() {
    const passSummary = {
      strength: '',
      opportunities: '',
      weaknesses: '',
      threats: '',
    };
    const passBusinessActivity = {
      visitBy: '',
      visitWith: '',
      visitDate: '',
      positionInCompany: '',
      venue: '',
      notes: '',
    };
    this.creditProposal.attributes['tabSummary'] = this.creditProposal.attributes.tabSummary
      ? JSON.parse(this.creditProposal.attributes.tabSummary)
      : passSummary;

    this.getTasks();
    this.setMenu('');
    this.clickedMenu = 'basic-information';
    // this.selectedMenu = 'BASIC INFORMATION';
  }

  public setSubmenu(element: string): void {
    const obj: object = lodash.find(PROPOSAL_TYPE, function (o) {
      return o['id'] === element || o['text'] === element;
    });
    if (obj) {
      this.subMenu = BASIC_SUBMENU_CREDITPROPOSAL;
      if (obj['id'] === 'greater-15-bn') {
        this.subMenu = [...this.subMenu, ...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN];
      } else if (obj['id'] === 'lower-equal-15-bn') {
        this.subMenu = [...this.subMenu, ...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN];
      } else {
        this.subMenu = [...this.subMenu, ...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK];
      }
      this.clickedMenu = 'basic-information';
    }
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }

  private getTasks(): void {
    this.creditProposalProcessService.getTasks(this.id).subscribe(res => {
      this.tasks = res.body;
    });
  }

  private setMenu(value: string): void {
    this.menuItems = lodash.clone(this.menuItemsAll);
    const compareVal = value === '' ? this.creditProposal.attributes.proposalType : value;
    if (compareVal === 'Total Exposure > IDR 15 Bn' || compareVal === 'Total Exposure Back to Back') {
      this.spliceMenus(['REPAYMENT CAPABILITY']);
      if (compareVal === 'Total Exposure Back to Back') {
        this.spliceMenus(['TRADE CHECKING', 'GROUP & GUARANTOUR ANALYSIS', 'CREDIT RATING']);
      }
    } else {
      this.spliceMenus(['TRADE CHECKING', 'GROUP & GUARANTOUR ANALYSIS', 'CREDIT RATING']);
      // , 'CUSTOMER PROFITABILITY & CROSS SELLING FACTOR'
    }
  }

  public onProposalTypeChange(value: any): void {
    this.setMenu(value.value);

    this.subMenuItems = value.value;
  }

  private spliceMenus(menus: string[]): void {
    for (let i = 0; i < menus.length; i++) {
      for (let j = 0; j < this.menuItems.length; j++) {
        if (this.menuItems[j].text === menus[i]) {
          this.menuItems.splice(j, 1);
        }
      }
    }
  }

  public processTask(task: IProcessTask): void {
    const dialogRef = this.dialog.open(TaskCommentDialogComponent, {
      width: '80vw',
      data: { processTask: task },
    });
    dialogRef.afterClosed().subscribe(_res => {
      if (_res) {
        this.creditProposalProcessService.processTask(task).subscribe(res => {
          this.router.navigate(['./credit-proposal']);
        });
      }
    });
  }

  private preSave(): ICreditProposal {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    copyCreditProposal.attributes['businessGroup'] = JSON.stringify(copyCreditProposal.attributes['businessGroup']);
    copyCreditProposal.attributes['shareHolder'] = JSON.stringify(copyCreditProposal.attributes['shareHolder']);
    copyCreditProposal.attributes['correspondence'] = JSON.stringify(copyCreditProposal.attributes['correspondence']);
    copyCreditProposal.attributes['basicInformation'] = JSON.stringify(copyCreditProposal.attributes['basicInformation']);
    copyCreditProposal.attributes['guaranturAnalysis'] = JSON.stringify(copyCreditProposal.attributes['guaranturAnalysis']);
    copyCreditProposal.attributes['riksCriteria'] = JSON.stringify(copyCreditProposal.attributes['riksCriteria']);
    copyCreditProposal.attributes['convenant'] = JSON.stringify(copyCreditProposal.attributes['convenant']);
    copyCreditProposal.attributes['creditProposalParent'] = JSON.stringify(copyCreditProposal.attributes['creditProposalParent']);
    copyCreditProposal.attributes['businessActivity'] = JSON.stringify(copyCreditProposal.attributes['businessActivity']);
    copyCreditProposal.attributes['analysisOfCalculation'] = JSON.stringify(copyCreditProposal.attributes['analysisOfCalculation']);
    copyCreditProposal.attributes['bankAnalyst'] = JSON.stringify(copyCreditProposal.attributes['bankAnalyst']);
    copyCreditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(copyCreditProposal.attributes['proformaLaporanKeuangan']);
    copyCreditProposal.attributes['tabSummary'] = JSON.stringify(copyCreditProposal.attributes['tabSummary']);
    copyCreditProposal.attributes['insurance'] = JSON.stringify(copyCreditProposal.attributes['insurance']);
    copyCreditProposal.attributes['binding'] = JSON.stringify(copyCreditProposal.attributes['binding']);
    copyCreditProposal.debtorData.attributes['prospectPerson'] = JSON.stringify(copyCreditProposal.debtorData.attributes['prospectPerson']);
    copyCreditProposal.attributes['repaymentCapability'] = JSON.stringify(copyCreditProposal.attributes['repaymentCapability']);
    copyCreditProposal.attributes['facilityDetail'] = JSON.stringify(this.creditProposal.attributes['facilityDetail']);
    copyCreditProposal.attributes['opinionHistory'] = JSON.stringify(this.creditProposal.attributes['opinionHistory']);
    copyCreditProposal.attributes['tabCustomer'] = JSON.stringify(this.creditProposal.attributes['tabCustomer']);
    copyCreditProposal.attributes['tradeCheckingSupplier'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingSupplier']);
    copyCreditProposal.attributes['tradeCheckingBuyers'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingBuyers']);
    copyCreditProposal.attributes['collateralChecklist'] = JSON.stringify(this.creditProposal.attributes['collateralChecklist']);
    copyCreditProposal.attributes['tabSummaryMessage'] = JSON.stringify(this.creditProposal.attributes['tabSummaryMessage']);
    copyCreditProposal.attributes['managementInfo'] = JSON.stringify(this.creditProposal.attributes['managementInfo']);
    copyCreditProposal.attributes['noteMessage'] = JSON.stringify(copyCreditProposal.attributes['noteMessage']);
    copyCreditProposal.attributes['purposePricing'] = JSON.stringify(copyCreditProposal.attributes['purposePricing']);
    copyCreditProposal.attributes['cpRacBelow'] = JSON.stringify(copyCreditProposal.attributes['cpRacBelow']);
    copyCreditProposal.attributes['cpRacBack'] = JSON.stringify(copyCreditProposal.attributes['cpRacBack']);
    copyCreditProposal.attributes['emptyField'] = JSON.stringify(copyCreditProposal.attributes['emptyField']);
    return copyCreditProposal;
  }

  public save(): void {
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.preSave()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    } else {
      this.creditProposalService.create(this.preSave()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    }
  }

  print() {
    this.reportUtils.viewFile('/services/report/api/report/credit-proposal/pdf', { id: this.creditProposal.id.toString });
  }
}
