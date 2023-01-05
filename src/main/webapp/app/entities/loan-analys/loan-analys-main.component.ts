import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { CreditProposalProcessService } from '../credit-proposal/credit-proposal-process.service';

import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import {
  SUBMENU_LOAN_ANALYS_APPROVAL_MONITORING,
  SUBMENU_LOAN_ANALYS_CC_CHECKING,
  SUBMENU_LOAN_ANALYS_CC_REVIEW,
  SUBMENU_LOAN_ANALYS_CP_SUMMARY,
  SUBMENU_LOAN_ANALYS_DAR_CHECKER,
  SUBMENU_LOAN_ANALYS_DAR_FINAL,
  SUBMENU_LOAN_ANALYS_LA_APPROVAL,
  SUBMENU_LOAN_ANALYS_LA_KOMITE,
  SUBMENU_LOAN_CP,
} from 'app/shared/constants/base.constants';
import { IPosition } from '../position/position.model';
import { SUBMENU_LOAN_ANALYS } from 'app/shared/constants/base.constants';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';

import { IApplicationRole, ApplicationRole } from '../application-role/application-role.model';
import { ApplicationRoleService } from '../application-role/application-role.service';
import _ from 'lodash';
import { LoanAnalysService } from './loan-analys.service';
import { LoanAnalysOpinionComponent } from './opinion/loan-analys-opinion.component';
import { CreditProposalCollateralInfoComponent } from '../credit-proposal/collateral-info/credit-proposal-collateral-info.component';

@Component({
  selector: 'jhi-loan-analys-main',
  templateUrl: './loan-analys-main.component.html',
  styleUrls: ['./loan-analys-main.css'],
})
export class LoanAnalysMainComponent implements OnInit {
  @ViewChild('loanAnalysOpinionComponent', {
    static: false,
  })
  loanAnalysOpinionComponent: LoanAnalysOpinionComponent;

  @ViewChild('creditProposalCollateralInfoComponent', {
    static: false,
  })
  creditProposalCollateralInfoComponent: CreditProposalCollateralInfoComponent;

  private id: number;

  public url: string;
  public subMenu: object[];
  public tasks: IProcessTask[] = new Array<IProcessTask>();
  public postalAdresss;
  public selectedMenu: string;
  public saveWord: Boolean = false;
  public saveWordOpinionCondition: Boolean = false;

  public creditProposal: ICreditProposal;
  public position: IPosition[];
  public currentAccount: Account;
  public applicationRoles: IApplicationRole[];
  public applicationRole: IApplicationRole;
  public applicationRoleId: number;
  public activeRoute: string;
  public title: string;
  public value: string;
  public parentPath = this.router.url.split('/')[1];
  appName: any;
  appNameMenu: any;
  public titleUrl: string;
  public titleMenu: string;
  public cp: ICreditProposal;
  public isShow = false;
  public isHistoryExist: boolean;

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    protected messageService: MessageService,
    public accountService: AccountService,
    public applicationRoleService: ApplicationRoleService,
    public loanAnalystService: LoanAnalysService
  ) {
    this.applicationRole = new ApplicationRole();
    this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.activeRoute = this.router.url.replace(/\//g, '');
    this.selectedMenu = 'credit-proposal-summary';
    this.isHistoryExist = this.creditProposal.attributes.previousHistory ? true : false;

    this.url = this.parentPath; // kebutuhan buat assign to
    switch (this.parentPath) {
      case 'la-distribution':
        this.creditProposal.statusId === 'CP_APPROVE_TO_LA'
          ? (this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY)
          : (this.subMenu = SUBMENU_LOAN_ANALYS);
        break;

      case 'la-SME-CRC':
        this.subMenu = [
          ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
          { id: 'opinion', text: 'Opinion' },
          { id: 'compare-data', text: 'Compare Data' },
        ];
        break;

      case 'cc-distribution':
        this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY;
        break;

      case 'la-analyst':
        this.subMenu = [...SUBMENU_LOAN_ANALYS];
        break;

      case 'la-approval':
        this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL];
        break;

      case 'la-approval-inquiry':
        this.subMenu = [
          ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
          { id: 'opinion', text: 'Opinion' },
          ...SUBMENU_LOAN_CP,
          { id: 'compare-data', text: 'Compare Data' },
        ];
        break;
      case 'dar-final':
        this.subMenu = SUBMENU_LOAN_ANALYS_DAR_FINAL;
        break;

      case 'dar-checker':
        this.subMenu = SUBMENU_LOAN_ANALYS_DAR_CHECKER;
        break;

      case 'loan-committee-approval':
        this.subMenu = SUBMENU_LOAN_ANALYS_LA_KOMITE;
        break;

      case 'cc-checking':
        this.subMenu = SUBMENU_LOAN_ANALYS_CC_CHECKING;
        break;

      case 'cc-review':
      case 'cc-inquiry':
        this.subMenu = SUBMENU_LOAN_ANALYS_CC_REVIEW;
        break;

      case 'loan-analys-and-approval-monitoring':
        this.subMenu = SUBMENU_LOAN_ANALYS_APPROVAL_MONITORING;
        break;

      default:
        this.subMenu = SUBMENU_LOAN_ANALYS;
        break;
    }

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
    this.getTitleUrl();
    this.getTitleMenu();
  }

  ngOnInit() {
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });

    this.creditProposalService.find(this.activatedRoute.snapshot.data['loanAnalys'].id).subscribe((response: any) => {
      this.cp = response.body;
    });

    const passSummary = {
      strength: '',
      opportunities: '',
      weaknesses: '',
      threats: '',
    };
    this.creditProposal.attributes['tabSummary'] = this.creditProposal.attributes.tabSummary
      ? JSON.parse(this.creditProposal.attributes.tabSummary)
      : passSummary;
    this.getTasks();
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });
    this.getTitle();
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
          this.router.navigate([this.router.url.split('/')[1]]);
        });
      }
    });
  }

  public previousState(): void {
    window.history.back();
  }

  public goToSubMenu(menu: string): void {
    this.selectedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    const routeHelper =
      this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3].substr(0, 13);
    this.router.navigate([routeHelper], { queryParams: { subroute: menu['id'] } });
  }

  private addNewNotes(messageVal: any, recomendationVal: string, conditionVal: string, positionVal: string, userIdVal: string): INotes {
    let note: INotes = new Notes();

    return (note = {
      message: messageVal,
      userId: userIdVal,
      positionUserId: positionVal,
      recomendation: recomendationVal,
      condition: conditionVal,
      createDate: new Date(),
    });
  }

  // get data from child
  public onAssignTo(ev: any): void {
    this.applicationRole = ev.applicationRole;
    this.applicationRoleId = ev.applicationRoleId;
  }

  private saveApplicationRole(): void {
    if (this.applicationRole.id) {
      this.applicationRoleService.update(this.applicationRole).subscribe(res => {
        this.creditProposalService.find(this.activatedRoute.snapshot.data['loanAnalys'].id).subscribe((response: any) => {
          this.cp = response.body;
        });

        if (this.creditProposalCollateralInfoComponent) {
          this.creditProposalCollateralInfoComponent.triggeredSave(this.creditProposal.attributes.proposalType);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    } else {
      this.applicationRoleService.create(this.applicationRole).subscribe(res => {
        this.creditProposalService.find(this.activatedRoute.snapshot.data['loanAnalys'].id).subscribe((response: any) => {
          this.cp = response.body;
        });

        if (this.creditProposalCollateralInfoComponent) {
          this.creditProposalCollateralInfoComponent.triggeredSave(this.creditProposal.attributes.proposalType);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    }
  }

  public userId: any;
  public InternalId: any;
  public positionApproval: any;
  private preSave(): ICreditProposal {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    if (lodash.has(copyCreditProposal.attributes, 'tempLoggedInNotes') && this.parentPath !== 'loan-committee-approval') {
      this.extPreSave(copyCreditProposal);
    } else {
      this.extPreSave(copyCreditProposal);
    }

    copyCreditProposal.attributes['businessGroup'] = JSON.stringify(copyCreditProposal.attributes['businessGroup']);
    copyCreditProposal.attributes['shareHolder'] = JSON.stringify(copyCreditProposal.attributes['shareHolder']);
    copyCreditProposal.attributes['correspondence'] = JSON.stringify(copyCreditProposal.attributes['correspondence']);
    copyCreditProposal.attributes['basicInformation'] = JSON.stringify(copyCreditProposal.attributes['basicInformation']);
    copyCreditProposal.attributes['guaranturAnalysis'] = JSON.stringify(copyCreditProposal.attributes['guaranturAnalysis']);
    copyCreditProposal.attributes['riksCriteria'] = JSON.stringify(copyCreditProposal.attributes['riksCriteria']);
    copyCreditProposal.attributes['convenant'] = JSON.stringify(copyCreditProposal.attributes['convenant']);
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
    copyCreditProposal.attributes['creditProposalParent'] = JSON.stringify(copyCreditProposal.attributes['creditProposalParent']);
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
    copyCreditProposal.attributes['remarksFinancialStatement'] = JSON.stringify(copyCreditProposal.attributes['remarksFinancialStatement']);
    copyCreditProposal.attributes['tradeCheckingRemarks'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingRemarks']);
    copyCreditProposal.attributes['rejectReason'] = JSON.stringify(copyCreditProposal.attributes['rejectReason']);
    copyCreditProposal.attributes['legalLendingLimit'] = JSON.stringify(copyCreditProposal.attributes['legalLendingLimit']);

    return copyCreditProposal;
  }

  private extPreSave(copyCreditProposal: any): void {
    let tempHelper = 0;
    if (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE') {
      this.userId = copyCreditProposal.attributes['userId'];
      this.InternalId = copyCreditProposal.attributes['internalApprovaluser'];
      this.positionApproval = copyCreditProposal.attributes['position'];
      if (copyCreditProposal.notes.length > 0) {
        for (let i = 0; i < copyCreditProposal.notes.length; i++) {
          if (copyCreditProposal.notes[i].userId === this.userId) {
            copyCreditProposal.notes[i].condition = copyCreditProposal.attributes['tempLoggedInCondition'];
            copyCreditProposal.notes[i].positionUserId = this.positionApproval;
            copyCreditProposal.notes[i].recomendation = copyCreditProposal.attributes['tempLoggedInRecomendationUser'];
            tempHelper = tempHelper + 1;
          }
        }

        if (tempHelper === 0) {
          copyCreditProposal.notes.push(
            this.addNewNotes(
              copyCreditProposal.attributes['tempLoggedInNotes'] ? copyCreditProposal.attributes['tempLoggedInNotes'] : '',
              copyCreditProposal.attributes['tempLoggedInRecomendationUser'],
              this.InternalId,
              this.positionApproval,
              this.userId
            )
          );
        }
      } else {
        copyCreditProposal.notes.push(
          this.addNewNotes(
            copyCreditProposal.attributes['tempLoggedInNotes'] ? copyCreditProposal.attributes['tempLoggedInNotes'] : '',
            copyCreditProposal.attributes['tempLoggedInRecomendationUser'],
            this.InternalId,
            this.positionApproval,
            this.userId
          )
        );
      }

      delete copyCreditProposal.attributes['tempLoggedInNotes'];
    } else {
      if (copyCreditProposal.notes.length > 0) {
        for (let i = 0; i < copyCreditProposal.notes.length; i++) {
          if (copyCreditProposal.notes[i].userId === this.currentAccount.login) {
            copyCreditProposal.notes[i].message = copyCreditProposal.attributes['tempLoggedInNotes']
              ? copyCreditProposal.attributes['tempLoggedInNotes']
              : '';
            copyCreditProposal.notes[i].recomendation = copyCreditProposal.attributes['tempLoggedInRecomendation'];
            copyCreditProposal.notes[i].condition = copyCreditProposal.attributes['tempLoggedInCondition'];
            copyCreditProposal.notes[i].positionUserId = copyCreditProposal.attributes['positionLogin'];
            tempHelper = tempHelper + 1;
          }
        }

        if (tempHelper === 0) {
          copyCreditProposal.notes.push(
            this.addNewNotes(
              copyCreditProposal.attributes['tempLoggedInNotes'] ? copyCreditProposal.attributes['tempLoggedInNotes'] : '',
              copyCreditProposal.attributes['tempLoggedInRecomendation'],
              copyCreditProposal.attributes['tempLoggedInCondition'],
              copyCreditProposal.attributes['positionLogin'],
              this.currentAccount.login
            )
          );
        }
      } else {
        copyCreditProposal.notes.push(
          this.addNewNotes(
            copyCreditProposal.attributes['tempLoggedInNotes'] ? copyCreditProposal.attributes['tempLoggedInNotes'] : '',
            copyCreditProposal.attributes['tempLoggedInRecomendation'],
            copyCreditProposal.attributes['tempLoggedInCondition'],
            copyCreditProposal.attributes['positionLogin'],
            this.currentAccount.login
          )
        );
      }
      delete copyCreditProposal.attributes['tempLoggedInNotes'];
      delete copyCreditProposal.attributes['tempLoggedInRecomendation'];
      delete copyCreditProposal.attributes['tempLoggedInCondition'];
      delete copyCreditProposal.attributes['positionLogin'];
    }
  }

  public saveDoc: boolean;

  public onSave(): void {
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.preSave()).subscribe(res => {
        if (this.loanAnalysOpinionComponent) {
          this.loanAnalysOpinionComponent.triggeredSave();
          this.loanAnalysOpinionComponent.triggeredSaveCondition();
          this.loanAnalysOpinionComponent.refresh();
          this.loanAnalysOpinionComponent.onCreate();
          this.loanAnalysOpinionComponent.onCreateCondition();
        }
        this.saveDoc = true;
        this.saveApplicationRole();
      });
    } else {
      this.creditProposalService.create(this.preSave()).subscribe(res => {
        if (this.loanAnalysOpinionComponent) {
          this.loanAnalysOpinionComponent.triggeredSave();
          this.loanAnalysOpinionComponent.triggeredSaveCondition();
          this.loanAnalysOpinionComponent.refresh();
          this.loanAnalysOpinionComponent.onCreate();
          this.loanAnalysOpinionComponent.onCreateCondition();
        }
        this.saveDoc = true;
        this.saveApplicationRole();
      });
    }
    this.saveWord = true;
    this.saveWordOpinionCondition = true;
  }

  public getTitle(): void {
    this.appName = sessionStorage.getItem('appName');
  }

  getText(value: any) {
    if (value === 'la-distribution') {
      this.title = 'Loan Analysis Distribution';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'la-analyst') {
      this.title = 'Loan Analysis';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'la-SME-CRC') {
      this.title = 'Loan Analysis SME Checker';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'la-approval') {
      this.title = 'Loan Approval';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'la-approval-inquiry') {
      this.title = 'Loan Approval Inquiry';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'dar-final') {
      this.title = 'DAR Finalization';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'dar-checker') {
      this.title = 'Final DAR - Checker';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'loan-committee-approval') {
      this.title = 'Loan Komite Approval';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'dar-notif') {
      this.title = 'DAR Notification';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'cc-distribution') {
      this.title = 'Compliance Checking Distribution';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'cc-checking') {
      this.title = 'Compliance Checking';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'cc-review') {
      this.title = 'Compliance Checking Review';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'cc-inquiry') {
      this.title = 'Compliance Checking';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'loan-analys-and-approval-monitoring') {
      this.title = 'Loan Analyst and Approval Monitoring';
      sessionStorage.setItem('appName', this.title);
    }
  }

  public getTitleUrl(): void {
    const x = this.router.url.split('/')[3];
    this.titleUrl = x;
  }

  getTextMenu() {
    if (this.selectedMenu === 'credit-proposal-summary') {
      this.titleMenu = 'Credit Proposal Summary';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'compliance-recomendation') {
      this.titleMenu = 'Compliance Recomendation';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'opinion') {
      this.titleMenu = 'Opinion';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'covenant-document-check') {
      this.titleMenu = 'Covenant & Document Checklist';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'document-checklist') {
      this.titleMenu = 'Document Checklist';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'basic-information') {
      this.titleMenu = 'Basic Information';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'management-information') {
      this.titleMenu = 'Management Information';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'exposure') {
      this.titleMenu = 'Exposure';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'risk-acceptance-criteria') {
      this.titleMenu = 'Risk Acceptance Criteria';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'loan-facility-detail') {
      this.titleMenu = 'Loan Facility Detail';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'loan-facility') {
      this.titleMenu = 'Loan Facility Detail';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'collateral-info') {
      this.titleMenu = 'Collateral Info';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'business-activity') {
      this.titleMenu = 'Business Activity';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'financial-statement') {
      this.titleMenu = 'Financial Statement';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'bank-account-analyst') {
      this.titleMenu = 'Bank Account Analyst';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'convenant-tbo') {
      this.titleMenu = 'Convenant & Tbo';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'propose-pricing') {
      this.titleMenu = 'Propose Pricing';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'summary') {
      this.titleMenu = 'Summary';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'compare-data') {
      this.titleMenu = 'Compare Data';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'complience-recommendation') {
      this.titleMenu = 'Complience Recommendation';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'slik-checking') {
      this.titleMenu = 'Slik Checking';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'facility-mapping') {
      this.titleMenu = 'Facility Mapping';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'mapping-facility') {
      this.titleMenu = 'Collateral Mapping Facility';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'correspondence') {
      this.titleMenu = 'Correspondence';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'group-guarantor-analyst') {
      this.titleMenu = 'Group Guarantor Analyst';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'slik-summary') {
      this.titleMenu = 'SLIK Checking';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'credit-rating') {
      this.titleMenu = 'Credit Rating';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'trade-checking') {
      this.titleMenu = 'Trade Checking';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
  }

  getTitleMenu(): void {
    this.appNameMenu = sessionStorage.getItem('appNameMenu');
  }
}
