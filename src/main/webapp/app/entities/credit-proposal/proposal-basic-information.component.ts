import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { CreditProposalProcessService } from './credit-proposal-process.service';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';
import { CreditProposalTabBusinessActivityComponent } from './busines-activity/credit-proposal-tab-business-activity.component';
import {
  BASIC_SUBMENU_CREDITPROPOSAL,
  PROPOSAL_TYPE,
  SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
  SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
  SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
  SEGMENTS_TYPE,
  ID_GREATER_15_BN,
  ID_LOWER_EQUAL_15_BN,
  ID_BACK_TO_BACK,
  CP_APPROVAL_MENU,
} from 'app/shared/constants/base.constants';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import _ from 'lodash';
import { IEJOptionNode } from 'app/shared/model/option-node.model';
import { IApplicationRole } from '../application-role/application-role.model';
import { ApplicationRoleService } from '../application-role/application-role.service';
import { CreditProposalOpinionHistoryComponent } from './opinion-history/credit-proposal-opinion-history.component';
import { CreditProposalTabSummaryComponent } from './credit-proposal-tab-summary.component';
import { CreditProposaTabManagementInfoComponent } from './credit-proposal-tab-management-info.component';
import { RemarskComponent } from './trade-checking/Remarks/credit-proposal-trade-checking-remarks.component';
import { CreditProposalCollateralInfoComponent } from './collateral-info/credit-proposal-collateral-info.component';

@Component({
  selector: 'jhi-credit-proposal-basic',
  templateUrl: './proposal-basic-information-floating.component.html',
  styleUrls: ['./proposal-basic-information.css'],
})
export class ProposalBasicInformationComponent implements OnInit {
  @ViewChild('creditProposalTabBusinessActivityComponent', {
    static: false,
  })
  creditProposalTabBusinessActivityComponent: CreditProposalTabBusinessActivityComponent;

  @ViewChild('creditProposalCollateralInfoComponent', {
    static: false,
  })
  creditProposalCollateralInfoComponent: CreditProposalCollateralInfoComponent;

  @ViewChild('creditProposalOpinionHistoryComponent', {
    static: false,
  })
  creditProposalOpinionHistoryComponent: CreditProposalOpinionHistoryComponent;

  @ViewChild('CreditProposalTabSummaryComponent', {
    static: false,
  })
  CreditProposalTabSummaryComponent: CreditProposalTabSummaryComponent;

  @ViewChild('creditProposaTabManagementInfoComponent', {
    static: false,
  })
  creditProposaTabManagementInfoComponent: CreditProposaTabManagementInfoComponent;

  @ViewChild('remaksComponent', {
    static: false,
  })
  remaksComponent: RemarskComponent;

  private id: number;
  public clickedMenu: string;
  public tasks: IProcessTask[] = new Array<IProcessTask>();

  public creditProposal: ICreditProposal;

  public proposalType: object[];

  public segmentType: object[];

  public currentAccount: Account;

  public subMenu: object[];
  public recomendation: string;

  public url: string;
  public activeRoute: string;
  public applicationRole: IApplicationRole;
  public applicationRoles: IApplicationRole[];
  public applicationRoleId: number;
  public routeHelper: string;
  public resAttr: IProcessTask;

  appName: any;
  appNameMenu: any;
  public title: string;
  public titleMenu: string;
  public value: string;
  public titleUrl: any;
  public parentPath = this.router.url.split('/')[1];
  public isHistoryExist: boolean;
  public cp: ICreditProposal;
  public saveWord: Boolean = false;
  public saveWordOpinionCondition: Boolean = false;
  public dataChil: any;

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected messageService: MessageService,
    public dialog: MatDialog,
    protected reportUtils: ReportUtilService,
    public accountService: AccountService,
    public applicationRoleService: ApplicationRoleService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.setMainMenuCp();

    this.subMenu = BASIC_SUBMENU_CREDITPROPOSAL;
    this.proposalType = PROPOSAL_TYPE;
    this.segmentType = SEGMENTS_TYPE;

    this.activeRoute = this.router.url.replace(/\//g, '');

    this.url = this.parentPath;
    this.menuCreditProposal();

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.clickedMenu = subRoute;
      }
    });
    this.isHistoryExist = this.creditProposal.attributes.previousHistory ? true : false;
  }

  setOpinionRecomendation(newItem: string) {
    this.recomendation = newItem;
  }

  ngOnInit() {
    this.getTitle();

    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.creditProposalService.find(this.activatedRoute.snapshot.data['content'].id).subscribe((response: any) => {
      this.cp = response.body;
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
    this.getTitleUrl();
    this.getTitleMenu();
  }

  public setSubmenu(event: IEJOptionNode): void {
    if (event) {
      if (event.id === ID_GREATER_15_BN) {
        if (this.parentPath === 'cp-status-approval') {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
            {
              id: 'opinion',
              text: 'Opinion',
            },
          ];
        } else {
          this.subMenu = SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN;
        }
      } else if (event.id === ID_LOWER_EQUAL_15_BN) {
        if (this.parentPath === 'cp-status-approval') {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
            {
              id: 'opinion',
              text: 'Opinion',
            },
          ];
        } else {
          this.subMenu = SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN;
        }
      } else if (event.id === ID_BACK_TO_BACK) {
        if (this.parentPath === 'cp-status-approval') {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
            {
              id: 'opinion',
              text: 'Opinion',
            },
          ];
        } else {
          this.subMenu = SUBMENU_CREDITPROPOSAL_BACK_TO_BACK;
        }
      } else {
        this.subMenu = PROPOSAL_TYPE;
      }
    } else {
      this.subMenu = PROPOSAL_TYPE;
    }
    // this.clickedMenu = 'basic-information';
  }

  public setMainMenuCp() {
    if (this.parentPath === 'cp-status-approval') {
      this.clickedMenu = 'credit-proposal-approval';
    } else if (this.parentPath === 'credit-proposal-status') {
      this.clickedMenu = 'basic-information';
    }
  }

  public menuCreditProposal() {
    if (this.parentPath === 'cp-status-approval') {
      if (
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bn' &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = [
          {
            id: 'credit-proposal-approval',
            text: 'Credit Proposal Summary',
          },
          ...CP_APPROVAL_MENU,
          {
            id: 'opinion',
            text: 'Opinion',
          },
        ];
        this.dataChil = 'child';
      } else if (
        this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bn' &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = [
          {
            id: 'credit-proposal-approval',
            text: 'Credit Proposal Summary',
          },
          ...CP_APPROVAL_MENU,
          {
            id: 'opinion',
            text: 'Opinion',
          },
        ];
        this.dataChil = 'child';
      } else if (
        this.creditProposal.attributes.proposalType === 'Total Exposure Back to Back' &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = [
          {
            id: 'credit-proposal-approval',
            text: 'Credit Proposal Summary',
          },
          ...CP_APPROVAL_MENU,
          {
            id: 'opinion',
            text: 'Opinion',
          },
        ];
        this.dataChil = 'child';
      } else {
        this.subMenu = PROPOSAL_TYPE;
      }
    } else if (this.parentPath === 'credit-proposal-status') {
      if (
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bn' &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN;
      } else if (
        this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bn' &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN;
      } else if (
        this.creditProposal.attributes.proposalType === 'Total Exposure Back to Back' &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = SUBMENU_CREDITPROPOSAL_BACK_TO_BACK;
      } else {
        this.subMenu = PROPOSAL_TYPE;
      }
    }
  }

  public goToSubMenu(menu: string): void {
    this.clickedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    if (menu['id'] === ID_GREATER_15_BN) {
      this.creditProposal.attributes.proposalType = 'Total Exposure > IDR 15 Bn';
      if (this.parentPath === 'credit-proposal-status') {
        this.subMenu = SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN;
      } else {
        this.subMenu = [
          {
            id: 'credit-proposal-approval',
            text: 'Credit Proposal Summary',
          },
          ...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
          {
            id: 'opinion',
            text: 'Opinion',
          },
        ];
      }
    }
    if (menu['id'] === ID_LOWER_EQUAL_15_BN) {
      this.creditProposal.attributes.proposalType = 'Total Exposure <= IDR 15 Bn';
      if (this.parentPath === 'credit-proposal-status') {
        this.subMenu = SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN;
      } else {
        this.subMenu = [
          {
            id: 'credit-proposal-approval',
            text: 'Credit Proposal Summary',
          },
          ...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
          {
            id: 'opinion',
            text: 'Opinion',
          },
        ];
      }
    }
    if (menu['id'] === ID_BACK_TO_BACK) {
      this.creditProposal.attributes.proposalType = 'Total Exposure Back to Back';
      if (this.parentPath === 'credit-proposal-status') {
        this.subMenu = SUBMENU_CREDITPROPOSAL_BACK_TO_BACK;
      } else {
        this.subMenu = [
          {
            id: 'credit-proposal-approval',
            text: 'Credit Proposal Summary',
          },
          ...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
          {
            id: 'opinion',
            text: 'Opinion',
          },
        ];
      }
    }
    this.routeHelper =
      this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3].substr(0, 4);

    this.router.navigate([this.routeHelper], {
      queryParams: {
        subroute: menu['id'],
      },
    });
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
      data: {
        processTask: task,
      },
    });
    dialogRef.afterClosed().subscribe(_res => {
      if (_res) {
        this.resAttr = _res;
        let exposure = 0;
        let init = 0;
        let change = 0;

        if (this.creditProposal.products.length > 0) {
          for (let i = 0; i < this.creditProposal.products.length; i++) {
            init = init + Number(this.creditProposal.products[i].attributes.initialLimit);
            change = change + Number(this.creditProposal.products[i].attributes.changes);
          }
        }

        exposure = init + change;

        this.resAttr.attr['applicationType'] = this.creditProposal.applicationTypeId;
        this.resAttr.attr['exposure'] = exposure;
        this.resAttr.attr['proposalType'] = this.creditProposal.attributes.proposalType;

        this.save('process');
      }
    });
  }

  private addNewNotes(messageVal: any, recomendationVal: string, conditionVal: string, userIdVal: string, positionVal: string): INotes {
    let note: INotes = new Notes();

    return (note = {
      message: messageVal,
      userId: userIdVal,
      createDate: new Date(),
      recomendation: recomendationVal,
      condition: conditionVal,
      positionUserId: positionVal,
    });
  }

  public onForwardTo(ev) {
    this.applicationRole = ev;
  }

  private saveApplicationRole(): void {
    this.saveWord = false;
    this.creditProposalProcessService.processTask(this.resAttr).subscribe(() => {
      this.router.navigate([this.router.url.split('/')[1]]);
    });
  }

  public save(source: string): void {
    if (this.creditProposal.attributes.proposalType === null || this.creditProposal.attributes.proposalType === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Select Proposal Type',
      });
    } else {
      this.saveWord = true;
      if (this.creditProposal.id) {
        this.creditProposalService.update(this.preSave()).subscribe(res => {
          this.creditProposal.products = res.body.products;
          if (this.creditProposalTabBusinessActivityComponent) {
            this.creditProposalTabBusinessActivityComponent.triggeredSaveAll();
          }

          if (this.creditProposalOpinionHistoryComponent) {
            this.creditProposalOpinionHistoryComponent.triggeredSave();
            this.creditProposalOpinionHistoryComponent.triggeredSaveCondition();
            this.creditProposalOpinionHistoryComponent.refresh();
          }

          if (this.CreditProposalTabSummaryComponent) {
            this.CreditProposalTabSummaryComponent.triggeredSave();
          }

          if (this.creditProposaTabManagementInfoComponent) {
            this.creditProposaTabManagementInfoComponent.triggeredSave();
          }

          if (this.creditProposalCollateralInfoComponent) {
            this.creditProposalCollateralInfoComponent.triggeredSave(this.creditProposal.attributes.proposalType);
          }

          if (this.remaksComponent) {
            this.remaksComponent.triggeredSave();
          }

          if (source === 'process') {
            if (this.parentPath === 'cp-status-approval') {
              this.saveApplicationRole();
            } else {
              this.creditProposalProcessService.processTask(this.resAttr).subscribe(() => {
                this.router.navigate([this.router.url.split('/')[1]]);
              });
            }
          } else if (source === 'default') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Save Success',
            });
            this.saveWord = false;
          }
        });
      } else {
        this.creditProposalService.create(this.preSave()).subscribe(res => {
          this.creditProposal.products = res.body.products;
          if (this.creditProposalTabBusinessActivityComponent) {
            this.creditProposalTabBusinessActivityComponent.triggeredSaveAll();
          }

          if (this.creditProposalOpinionHistoryComponent) {
            this.creditProposalOpinionHistoryComponent.triggeredSave();
            this.creditProposalOpinionHistoryComponent.triggeredSaveCondition();
            this.creditProposalOpinionHistoryComponent.refresh();
          }

          if (this.CreditProposalTabSummaryComponent) {
            this.CreditProposalTabSummaryComponent.triggeredSave();
          }

          if (this.creditProposaTabManagementInfoComponent) {
            this.creditProposaTabManagementInfoComponent.triggeredSave();
          }

          if (this.remaksComponent) {
            this.remaksComponent.triggeredSave();
          }

          if (this.creditProposalCollateralInfoComponent) {
            this.creditProposalCollateralInfoComponent.triggeredSave(this.creditProposal.attributes.proposalType);
          }

          if (source === 'process') {
            if (this.parentPath === 'cp-status-approval') {
              this.saveApplicationRole();
            } else {
              this.creditProposalProcessService.processTask(this.resAttr).subscribe(() => {
                this.router.navigate([this.router.url.split('/')[1]]);
              });
            }
          } else if (source === 'default') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Save Success',
            });
            this.saveWord = false;
          }
        });
      }
    }
  }

  private preSave(): ICreditProposal {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    let tempHelper = 0;
    if (lodash.has(copyCreditProposal.attributes, 'tempLoggedInNotes')) {
      if (copyCreditProposal.notes.length > 0) {
        for (let i = 0; i < copyCreditProposal.notes.length; i++) {
          if (copyCreditProposal.notes[i].userId === this.currentAccount.firstName + ' ' + this.currentAccount.lastName) {
            copyCreditProposal.notes[i].message = '';
            copyCreditProposal.notes[i].recomendation = this.recomendation;
            copyCreditProposal.notes[i].condition = '';
            copyCreditProposal.notes[i].positionUserId = copyCreditProposal.attributes['positionLogin'];
            tempHelper = tempHelper + 1;
          }
        }

        if (tempHelper === 0) {
          copyCreditProposal.notes.push(
            this.addNewNotes('', this.recomendation, '', this.currentAccount.firstName + ' ' + this.currentAccount.lastName, copyCreditProposal.attributes['positionLogin'])
          );
        }
      } else {
        copyCreditProposal.notes.push(
          this.addNewNotes('', this.recomendation, '', this.currentAccount.firstName + ' ' + this.currentAccount.lastName, copyCreditProposal.attributes['positionLogin'])
        );
      }
      delete copyCreditProposal.attributes['tempLoggedInNotes'];
      delete copyCreditProposal.attributes['tempLoggedInRecomendation'];
      delete copyCreditProposal.attributes['tempLoggedInCondition'];
      delete copyCreditProposal.attributes['positionLogin'];
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
    copyCreditProposal.attributes['tradeCheckingRemarks'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingRemarks']);
    copyCreditProposal.attributes['collateralChecklist'] = JSON.stringify(this.creditProposal.attributes['collateralChecklist']);
    copyCreditProposal.attributes['tabSummaryMessage'] = JSON.stringify(this.creditProposal.attributes['tabSummaryMessage']);
    copyCreditProposal.attributes['managementInfo'] = JSON.stringify(this.creditProposal.attributes['managementInfo']);
    copyCreditProposal.attributes['purposePricing'] = JSON.stringify(copyCreditProposal.attributes['purposePricing']);
    copyCreditProposal.attributes['cpRacBelow'] = JSON.stringify(copyCreditProposal.attributes['cpRacBelow']);
    copyCreditProposal.attributes['cpRacBack'] = JSON.stringify(copyCreditProposal.attributes['cpRacBack']);
    copyCreditProposal.attributes['emptyField'] = JSON.stringify(copyCreditProposal.attributes['emptyField']);
    copyCreditProposal.attributes['collateralPrevious'] = JSON.stringify(copyCreditProposal.attributes['collateralPrevious']);
    copyCreditProposal.attributes['facilityTakeOver'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOver']);
    copyCreditProposal.attributes['facilityTakeOverAfterBank'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOverAfterBank']);
    copyCreditProposal.attributes['complienceReccomendation'] = JSON.stringify(copyCreditProposal.attributes['complienceReccomendation']);
    copyCreditProposal.attributes['industryLimit'] = JSON.stringify(copyCreditProposal.attributes['industryLimit']);
    copyCreditProposal.attributes['offeringLetter'] = JSON.stringify(copyCreditProposal.attributes['offeringLetter']);
    copyCreditProposal.attributes['bankAnalystMessage'] = JSON.stringify(copyCreditProposal.attributes['bankAnalystMessage']);
    copyCreditProposal.attributes['previous'] = JSON.stringify(copyCreditProposal.attributes['previous']);
    copyCreditProposal.attributes['offeringLetterPreparation'] = JSON.stringify(copyCreditProposal.attributes['offeringLetterPreparation']);
    copyCreditProposal.attributes['creditProposalCollateralData'] = JSON.stringify(
      copyCreditProposal.attributes['creditProposalCollateralData']
    );
    copyCreditProposal.attributes['retriveData'] = JSON.stringify(copyCreditProposal.attributes['retriveData']);
    copyCreditProposal.attributes['remarksFinancialStatement'] = JSON.stringify(
      this.creditProposal.attributes['remarksFinancialStatement']
    );
    copyCreditProposal.attributes['rejectReason'] = JSON.stringify(copyCreditProposal.attributes['rejectReason']);
    copyCreditProposal.attributes['legalLendingLimit'] = JSON.stringify(copyCreditProposal.attributes['legalLendingLimit']);
    copyCreditProposal.attributes['calculationExposure'] = JSON.stringify(copyCreditProposal.attributes['calculationExposure']);
    copyCreditProposal.groupProducts = [];

    return copyCreditProposal;
  }

  print() {
    this.reportUtils.viewFile('/services/report/api/report/credit-proposal/pdf', {
      id: this.creditProposal.id.toString,
    });
  }

  setSegmenTypes(value: any) {
    if (value.id === 'SME') {
      this.creditProposal.applicationTypeId = 'SME';
      this.creditProposal.applicationTypeDescription = 'SME';
    } else if (value.id === 'COMMERCIAL') {
      this.creditProposal.applicationTypeId = 'COMMERCIAL';
      this.creditProposal.applicationTypeDescription = 'Commercial Bank';
    } else if (value.id === 'CORPORATE') {
      this.creditProposal.applicationTypeId = 'CORPORATE';
      this.creditProposal.applicationTypeDescription = 'Corporate Bank';
    } else if (value.id === 'ENTERPRISE') {
      this.creditProposal.applicationTypeId = 'ENTERPRISE';
      this.creditProposal.applicationTypeDescription = 'Enterprise Bank';
    } else if (value.id === 'GLOBALBS') {
      this.creditProposal.applicationTypeId = 'GLOBALBS';
      this.creditProposal.applicationTypeDescription = 'Global Business';
    }
  }

  getText(value: any) {
    if (value === 'cp-status-approval') {
      this.title = 'Credit Proposal Approval';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'credit-proposal-status') {
      this.title = 'Credit Proposal';
      sessionStorage.setItem('appName', this.title);
    }
  }

  getTitle() {
    this.appName = sessionStorage.getItem('appName');
  }

  getTextMenu() {
    if (this.clickedMenu === 'credit-proposal-approval') {
      this.titleMenu = 'Credit Proposal Approval';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'basic-information') {
      this.titleMenu = 'Basic Information';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'management-information') {
      this.titleMenu = 'Management Information';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'exposure') {
      this.titleMenu = 'Exposure';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'risk-acceptance-criteria') {
      this.titleMenu = 'Risk Acceptance Criteria';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'loan-facility-detail') {
      this.titleMenu = 'Loan Facility Detail';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'collateral-info') {
      this.titleMenu = 'Collateral Info';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'business-activity') {
      this.titleMenu = 'Business Activity';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'financial-statement') {
      this.titleMenu = 'Financial Statement';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'slik-checking') {
      this.titleMenu = 'Slik Checking';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'bank-account-analyst') {
      this.titleMenu = 'Bank Account Analyst';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'trade-checking') {
      this.titleMenu = 'Trade Checking';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'convenant-tbo') {
      this.titleMenu = 'Covenant & Tbo';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'propose-pricing') {
      this.titleMenu = 'Propose Pricing';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'summary') {
      this.titleMenu = 'Summary';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'group-guarantour-analyst') {
      this.titleMenu = 'Group Guarantor Analyst';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'credit-rating') {
      this.titleMenu = 'Credit Rating';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.clickedMenu === 'repayment-capability') {
      this.titleMenu = 'Repayment Capability';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
  }

  getTitleMenu() {
    this.appNameMenu = sessionStorage.getItem('appNameMenu');
  }

  getTitleUrl() {
    const x = this.router.url.split('/')[3].slice(0, 4).split('?');

    this.titleUrl = x;
  }
  disabledProptype() {
    if (this.parentPath === 'cp-status-approval') {
      return true;
    }
    return false;
  }

  public notes: any;
}
