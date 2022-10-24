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
  SEGMENTS_TYPE,
} from 'app/shared/constants/base.constants';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';

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

  public segementType: object[];

  public currentAccount: Account;

  public subMenu: object[];

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected messageService: MessageService,
    public dialog: MatDialog,
    protected reportUtils: ReportUtilService,
    public accountService: AccountService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.subMenu = BASIC_SUBMENU_CREDITPROPOSAL;
    this.proposalType = PROPOSAL_TYPE;
    this.segementType = SEGMENTS_TYPE;
  }

  ngOnInit() {
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });

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

    this.clickedMenu = 'basic-information';
  }

  public setSubmenu(element: string): void {
    const obj: object = lodash.find(PROPOSAL_TYPE, function (o) {
      return o['id'] === element || o['text'] === element;
    });
    if (obj) {
      this.subMenu = BASIC_SUBMENU_CREDITPROPOSAL;
      const menuAbove = SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN;
      const menuBelow = SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN;
      const mainMenuBelow = [];
      const mainMenuAbove = [];
      if (obj['id'] === 'greater-15-bn') {
        mainMenuAbove.push(this.subMenu[0]);
        mainMenuAbove.push(this.subMenu[1]);
        mainMenuAbove.push(this.subMenu[2]);
        mainMenuAbove.push(this.subMenu[3]);
        mainMenuAbove.push(this.subMenu[4]);
        mainMenuAbove.push(this.subMenu[5]);
        mainMenuAbove.push(this.subMenu[6]);
        mainMenuAbove.push(this.subMenu[7]);
        mainMenuAbove.push(menuAbove[0]);
        mainMenuAbove.push(this.subMenu[8]);
        mainMenuAbove.push(this.subMenu[9]);
        mainMenuAbove.push(this.subMenu[10]);
        mainMenuAbove.push(menuAbove[1]);
        mainMenuAbove.push(this.subMenu[11]);
        mainMenuAbove.push(this.subMenu[12]);
        mainMenuAbove.push(this.subMenu[13]);
        mainMenuAbove.push(this.subMenu[14]);
        this.subMenu = mainMenuAbove;
      } else if (obj['id'] === 'lower-equal-15-bn') {
        mainMenuBelow.push(this.subMenu[0]);
        mainMenuBelow.push(this.subMenu[1]);
        mainMenuBelow.push(this.subMenu[2]);
        mainMenuBelow.push(this.subMenu[3]);
        mainMenuBelow.push(this.subMenu[4]);
        mainMenuBelow.push(this.subMenu[5]);
        mainMenuBelow.push(this.subMenu[6]);
        mainMenuBelow.push(this.subMenu[7]);
        mainMenuBelow.push(menuBelow[0]);
        mainMenuBelow.push(this.subMenu[8]);
        mainMenuBelow.push(this.subMenu[9]);
        mainMenuBelow.push(this.subMenu[10]);
        mainMenuBelow.push(this.subMenu[11]);
        mainMenuBelow.push(this.subMenu[12]);
        mainMenuBelow.push(this.subMenu[13]);
        mainMenuBelow.push(this.subMenu[14]);
        this.subMenu = mainMenuBelow;
      } else {
        this.subMenu = [...this.subMenu];
      }
      this.clickedMenu = 'basic-information';
    }
  }

  public previousState(): void {
    window.history.back();
  }

  private getTasks(): void {
    this.creditProposalProcessService.getTasks(this.id).subscribe(res => {
      this.tasks = res.body;
    });
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

  private addNewNotes(messageVal: any, userIdVal: string): INotes {
    let note: INotes = new Notes();

    return (note = {
      message: messageVal,
      userId: userIdVal,
      createDate: new Date(),
      recomendation: '',
      condition: '',
    });
  }

  private preSave(): ICreditProposal {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    let tempHelper = 0;

    if (lodash.has(copyCreditProposal.attributes, 'tempLoggedInNotes')) {
      if (copyCreditProposal.notes.length > 0) {
        for (let i = 0; i < copyCreditProposal.notes.length; i++) {
          if (copyCreditProposal.notes[i].userId === this.currentAccount.login) {
            copyCreditProposal.notes[i].message = copyCreditProposal.attributes['tempLoggedInNotes'];
            tempHelper = tempHelper + 1;
          }
        }

        if (tempHelper === 0) {
          copyCreditProposal.notes.push(this.addNewNotes(copyCreditProposal.attributes['tempLoggedInNotes'], this.currentAccount.login));
        }
      } else {
        copyCreditProposal.notes.push(this.addNewNotes(copyCreditProposal.attributes['tempLoggedInNotes'], this.currentAccount.login));
      }
      delete copyCreditProposal.attributes['tempLoggedInNotes'];
    }

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
    copyCreditProposal.attributes['collateralPrevious'] = JSON.stringify(copyCreditProposal.attributes['collateralPrevious']);
    copyCreditProposal.attributes['facilityTakeOver'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOver']);
    copyCreditProposal.attributes['facilityTakeOverAfterBank'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOverAfterBank']);
    copyCreditProposal.attributes['complienceRecommendation'] = JSON.stringify(copyCreditProposal.attributes['complienceRecommendation']);
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

  setSegmenTypes(value: any) {
    const obj: object = lodash.find(SEGMENTS_TYPE, function (o) {
      return o['id'] === value || o['text'] === value;
    });
    if (obj) {
      this.segementType = SEGMENTS_TYPE;

      if (value === 'SME') {
        this.creditProposal.applicationTypeId = 'SME';
        this.creditProposal.applicationTypeDescription = 'SME';
      } else if (value === 'COMMERCIAL') {
        this.creditProposal.applicationTypeId = 'COMMERCIAL';
        this.creditProposal.applicationTypeDescription = 'Commercial Bank';
      } else if (value === 'CORPORATE') {
        this.creditProposal.applicationTypeId = 'CORPORATE';
        this.creditProposal.applicationTypeDescription = 'Corporate Bank';
      } else if (value === 'ENTERPRISE') {
        this.creditProposal.applicationTypeId = 'ENTERPRISE';
        this.creditProposal.applicationTypeDescription = 'Enterprise Bank';
      } else if (value === 'GLOBALBS') {
        this.creditProposal.applicationTypeId = 'GLOBALBS';
        this.creditProposal.applicationTypeDescription = 'Global Business';
      }
    }
  }
}

// EJ 2 Menu Setup
// public selectedMenu: string;
// public subMenuItems = '';
// public menuItems: MenuItemModel[] = [];
// public menuItemsAll: MenuItemModel[] = [
//    { text: 'BASIC INFORMATION' },
//    { text: 'BUSINES ACTIVITY' },
//    { text: 'LOAN FACILITY DETAIL' },
//    { text: 'EXPOSURE' },
//    { text: 'RISK ACCEPTENCE CRITERIA' },
//    { text: 'COLLATERAL INFO' },
//    { text: 'MANAGEMENT INFORMATION' },
//    { text: 'SLIK CHECKING' },
//    { text: 'FINANCIAL STATEMENT' },
//    { text: 'BANK ACCOUNT ANALYSIS' },
//    { text: 'TRADE CHECKING' },
//    { text: 'CREDIT RATING' },
//    { text: 'REPAYMENT CAPABILITY' },
//    { text: 'CONVENANT & TBO' },
//    { text: 'DOCUMENT CHECKLIST' },
//    { text: 'PROPOSE PRICING' },
//    { text: 'GROUP & GUARANTOUR ANALYSIS' },
//    { text: 'SUMMARY' }
//  ];
// this.selectedMenu = 'BASIC INFORMATION';
// this.setMenu('');
// public selectMenuItem(args: MenuEventArgs): void {
//  this.selectedMenu = args.item.text;
// }
// private setMenu(value: string): void {
//  this.menuItems = lodash.clone(this.menuItemsAll);
//  const compareVal = value === '' ? this.creditProposal.attributes.proposalType : value;
//  if (compareVal === 'Total Exposure > IDR 15 Bn' || compareVal === 'Total Exposure Back to Back') {
//	this.spliceMenus(['REPAYMENT CAPABILITY']);
//	if (compareVal === 'Total Exposure Back to Back') {
//	  this.spliceMenus(['TRADE CHECKING', 'GROUP & GUARANTOUR ANALYSIS', 'CREDIT RATING']);
//	}
//  } else {
//	this.spliceMenus(['TRADE CHECKING', 'GROUP & GUARANTOUR ANALYSIS', 'CREDIT RATING']);
//  }
// }

// public onProposalTypeChange(value: any): void {
//  this.setMenu(value.value);
//
//  this.subMenuItems = value.value;
// }
// private spliceMenus(menus: string[]): void {
//  for (let i = 0; i < menus.length; i++) {
//	for (let j = 0; j < this.menuItems.length; j++) {
//	  if (this.menuItems[j].text === menus[i]) {
//		this.menuItems.splice(j, 1);
//	  }
//	}
//  }
// }
