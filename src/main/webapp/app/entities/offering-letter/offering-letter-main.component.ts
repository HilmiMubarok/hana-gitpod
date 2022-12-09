import { Component, ViewChild, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { CreditProposalProcessService } from '../credit-proposal/credit-proposal-process.service';
import { AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import { POSITION_TYPE, SUBMENU_OFFERING_LETTER } from 'app/shared/constants/base.constants';
import { PositionService } from '../position/position.service';
import { IPosition } from '../position/position.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';

import { IApplicationRole, ApplicationRole } from '../application-role/application-role.model';
import { ApplicationRoleService } from '../application-role/application-role.service';
import _ from 'lodash';
import { ReportUtilService } from 'app/shared/base/report-util.service';

@Component({
  selector: 'jhi-offering-letter-main',
  templateUrl: './offering-letter-main.component.html',
  styleUrls: ['./offering-letter-main.css'],
})
export class OfferingLetterMainComponent implements OnInit {
  private id: number;

  public url: string;
  public subMenu: object[];
  public tasks: IProcessTask[] = new Array<IProcessTask>();
  public postalAdresss;
  public selectedMenu: string;

  public creditProposal: ICreditProposal;
  public position: IPosition[];
  public currentAccount: Account;
  public applicationRoles: IApplicationRole[];
  public applicationRole: IApplicationRole;
  public applicationRoleId: number;
  public activeRoute: string;
  appNameMenu: any;
  appName: any;
  public title: string;
  public titleMenu: string;
  public value: string;
  public titleUrl: any;
  public parentPath = this.router.url.split('/')[1];
  public saveWordOpinionCondition:Boolean = false;
  public saveWord:Boolean = false;

  @Input('item')
  get item() {
    return this.creditProposal;
  }

  set item(item: any) {
    this.creditProposal = item;
  }

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    protected messageService: MessageService,
    private positionService: PositionService,
    public accountService: AccountService,
    public applicationRoleService: ApplicationRoleService,
    protected reportUtils: ReportUtilService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['offeringLetter'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.applicationRole = new ApplicationRole();

    this.activeRoute = this.router.url.replace(/\//g, '');
    this.url = this.parentPath;

    this.selectedMenu = 'credit-proposal-summary';
    this.subMenu = SUBMENU_OFFERING_LETTER;

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
    this.getTitleUrl();
  }

  public onAssignTo(ev) {
    this.applicationRole = ev.applicationRole;
    this.applicationRoleId = ev.applicationRoleId;
  }

  private saveApplicationRole(): void {
    if (this.applicationRole.id) {
      this.applicationRoleService.update(this.applicationRole).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    } else {
      this.applicationRoleService.create(this.applicationRole).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    }
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
    this.creditProposal.attributes['tabSummary'] = this.creditProposal.attributes.tabSummary
      ? JSON.parse(this.creditProposal.attributes.tabSummary)
      : passSummary;
    this.getTasks();
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });

    this.getTitle();
    this.getTitleMenu();
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

  print() {
    const id = this.item.id;
    this.reportUtils.downloadFile2('/services/report/api/report/spkk/word-stream/' + id, '', 'Report_' + id);
  }

  public previousState(): void {
    window.history.back();
  }

  public goToSubMenu(menu: string): void {
    this.selectedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    const routeHelper =
      this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3].substr(0, 4);
    this.router.navigate([routeHelper], { queryParams: { subroute: menu['id'] } });
  }

  private addNewNotes(messageVal: any, recomendationVal: string, conditionVal: string, userIdVal: string): INotes {
    let note: INotes = new Notes();

    return (note = {
      message: messageVal,
      userId: userIdVal,
      createDate: new Date(),
      recomendation: recomendationVal,
      condition: conditionVal,
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
            copyCreditProposal.notes[i].recomendation = copyCreditProposal.attributes['tempLoggedInRecomendation'];
            copyCreditProposal.notes[i].condition = copyCreditProposal.attributes['tempLoggedInCondition'];
            tempHelper = tempHelper + 1;
          }
        }

        if (tempHelper === 0) {
          copyCreditProposal.notes.push(
            this.addNewNotes(
              copyCreditProposal.attributes['tempLoggedInNotes'],
              copyCreditProposal.attributes['tempLoggedInRecomendation'],
              copyCreditProposal.attributes['tempLoggedInCondition'],
              this.currentAccount.login
            )
          );
        }
      } else {
        copyCreditProposal.notes.push(
          this.addNewNotes(
            copyCreditProposal.attributes['tempLoggedInNotes'],
            copyCreditProposal.attributes['tempLoggedInRecomendation'],
            copyCreditProposal.attributes['tempLoggedInCondition'],
            this.currentAccount.login
          )
        );
      }
      delete copyCreditProposal.attributes['tempLoggedInNotes'];
      delete copyCreditProposal.attributes['tempLoggedInRecomendation'];
      delete copyCreditProposal.attributes['tempLoggedInCondition'];
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

    return copyCreditProposal;
  }

  public onSave(): void {
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.preSave()).subscribe(res => {
        this.saveApplicationRole();
      });
    } else {
      this.creditProposalService.create(this.preSave()).subscribe(res => {
        this.saveApplicationRole();
      });
    }
    this.saveWordOpinionCondition = true;
    this.saveWord = true;
  }

  getTitle() {
    this.appName = sessionStorage.getItem('appName');
  }

  getTitleUrl() {
    const x = this.router.url.split('/')[3];
    this.titleUrl = x;
    // console.log('navigasi', this.titleUrl);
  }

  getText(value: any) {
    if (value === 'distribution') {
      this.title = 'Offering Letter Distribution';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'finalize') {
      this.title = 'Offering Letter Finalize';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'review') {
      this.title = 'Offering Letter Review';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'confirmation') {
      this.title = 'Offering Letter Confirmation';
      sessionStorage.setItem('appName', this.title);
    }
  }

  getTextMenu() {
    if (this.selectedMenu === 'credit-proposal-summary') {
      this.titleMenu = 'Credit Proposal Summary';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'offering-letter') {
      this.titleMenu = 'Offering Letter';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'compliance-recomendation') {
      this.titleMenu = 'Compliance Recomendation';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
    if (this.selectedMenu === 'credit-opinion') {
      this.titleMenu = 'Credit Opinion';
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
      this.titleMenu = 'Loan Facility';
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
    if (this.selectedMenu === 'compare-approval-report') {
      this.titleMenu = 'Compare Approval Report';
      sessionStorage.setItem('appNameMenu', this.titleMenu);
    }
  }

  getTitleMenu() {
    this.appNameMenu = sessionStorage.getItem('appNameMenu');
    console.log('ini appNameMenu', this.appNameMenu);
  }
}
