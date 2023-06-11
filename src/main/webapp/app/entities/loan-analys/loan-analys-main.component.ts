import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { CreditProposalProcessService } from '../credit-proposal/credit-proposal-process.service';
import { LendingProgramParameterService } from '../lending-program-parameter/lending-program-parameter.service';

import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import {
  SUBMENU_LOAN_ANALYS_APPROVAL_MONITORING,
  SUBMENU_LOAN_ANALYS_BELOW_AND_BTB,
  SUBMENU_LOAN_ANALYS_CC_CHECKING,
  SUBMENU_LOAN_ANALYS_CC_REVIEW,
  SUBMENU_LOAN_ANALYS_CP_SUMMARY,
  SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
  SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
  SUBMENU_LOAN_ANALYS_DAR_CHECKER,
  SUBMENU_LOAN_ANALYS_DAR_CHECKER_ABOVE,
  SUBMENU_LOAN_ANALYS_DAR_CHECKER_BELOW,
  SUBMENU_LOAN_ANALYS_DAR_FINAL,
  SUBMENU_LOAN_ANALYS_DAR_FINAL_ABOVE,
  SUBMENU_LOAN_ANALYS_DAR_NOTIF_ABOVE,
  SUBMENU_LOAN_ANALYS_LA_APPROVAL,
  SUBMENU_LOAN_ANALYS_LA_APPROVAL_BELOW,
  SUBMENU_LOAN_ANALYS_LA_APPROVAL_BTB,
  SUBMENU_LOAN_ANALYS_LA_KOMITE,
  SUBMENU_LOAN_ANALYS_LA_KOMITE_BELOW_AND_BTB,
  SUBMENU_LOAN_COMMITTEE_APPROVAL_ABOVE,
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
import { LoanAnalysOpinionCompliancePartComponent } from './opinion/loan-analys-opinion-compliance-part.component';
import { CreditProposalCollateralInfoComponent } from '../credit-proposal/collateral-info/credit-proposal-collateral-info.component';
import { LoanFacilityDetailTempComponent } from './dar-final/loan-facility/credit-proposal-tab-loan-facility-detail.component';
import { StorageService } from '../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil, firstValueFrom } from 'rxjs';
import { formatBytes } from 'app/shared/helper/utils';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import { CollateralService } from '../collateral/collateral.service';
import { ICollateral } from '../collateral/collateral.model';
import { CollateralProperty, ICollateralProperty } from '../collateral-property/collateral-property.model';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';

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

  @ViewChild('loanAnalysOpinionCompliancePartComponent', {
    static: false,
  })
  loanAnalysOpinionCompliancePartComponent: LoanAnalysOpinionCompliancePartComponent;

  @ViewChild('loanFacilityDetailTempComponent', {
    static: false,
  })
  loanFacilityDetailTempComponent: LoanFacilityDetailTempComponent;

  @ViewChild('creditProposalCollateralInfoComponent', {
    static: false,
  })
  creditProposalCollateralInfoComponent: CreditProposalCollateralInfoComponent;

  private id: number;
  public disabledData: Boolean = true;
  public collateral: ICollateral[];
  public collateralProperties: ICollateralProperty[] = [];
  public url: string;
  public subMenu: object[];
  public tasks: IProcessTask[] = new Array<IProcessTask>();
  public postalAdresss;
  public selectedMenu: string;
  public saveWord: Boolean = false;
  public saveWordOpinionCondition: Boolean = false;

  public creditProposal: ICreditProposal;
  public creditProposalStartState: ICreditProposal;
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
  public darRouter: boolean;

  public uuidPath: any;
  public recomendation: string;
  public positionLoginFromEmit: number;
  public opinionType = '';
  public isAssignedTo: Boolean = false;

  public resAttr: any;
  public sourceSlikChecking: String;

  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  public dataFileDar = [];
  public dataFileCompliance = [];
  public saveDoc: boolean;

  public opinionFileSfdt: File;
  public opinionFileWord: File;
  public conditionFileSfdt: File;
  public conditionFileWord: File;

  private saveState: string;
  public parentSubject: Subject<any> = new Subject();
  public proposType = [];
  private KEYG = 'credit_proposal/summary';

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    protected messageService: MessageService,
    public accountService: AccountService,
    public applicationRoleService: ApplicationRoleService,
    public loanAnalystService: LoanAnalysService,
    private storageService: StorageService,
    private http: HttpClient,
    private generalParameterService: GeneralParameterService,
    private lendingProgramParameterService: LendingProgramParameterService,
    private collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService
  ) {
    this.applicationRole = new ApplicationRole();
    this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
    this.creditProposalStartState = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.activeRoute = this.router.url.replace(/\//g, '');
    this.selectedMenu = 'credit-proposal-summary';
    this.isHistoryExist = this.creditProposal.attributes.previousHistory ? true : false;
    this.sourceSlikChecking = this.creditProposal.statusId === 'CP_ASSIGNMENT' ? 'edit' : 'loan';
    this.darRouter = this.router.url.split('/').indexOf('dar-notif') > -1;
    this.url = this.parentPath;

    switch (this.parentPath) {
      case 'la-distribution':
        if (this.creditProposal.statusId === 'CP_APPROVE_TO_LA') {
          this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
            ? (this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY)
            : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
            ? (this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW)
            : (this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB);
        } else {
          this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
            ? (this.subMenu = [
                ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
                {
                  id: 'loan-slik-checking',
                  text: 'SLIK Checking',
                },
                {
                  id: 'opinion',
                  text: 'Opinion',
                },
                {
                  id: 'compare-data',
                  text: 'Compare Data',
                },
              ])
            : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
            ? (this.subMenu = [
                ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
                {
                  id: 'loan-slik-checking',
                  text: 'SLIK Checking',
                },
                {
                  id: 'opinion',
                  text: 'Opinion',
                },
                {
                  id: 'compare-data',
                  text: 'Compare Data',
                },
              ])
            : (this.subMenu = [
                ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
                {
                  id: 'loan-slik-checking',
                  text: 'SLIK Checking',
                },
                {
                  id: 'opinion',
                  text: 'Opinion',
                },
                {
                  id: 'compare-data',
                  text: 'Compare Data',
                },
              ]);
        }
        break;

      case 'la-SME-CRC':
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
          ? (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
            ])
          : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
          ? (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
            ])
          : (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
            ]);
        break;

      case 'cc-distribution':
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
          ? (this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY)
          : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
          ? (this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW)
          : (this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB);
        break;

      case 'la-analyst':
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
          ? (this.subMenu = [...SUBMENU_LOAN_ANALYS])
          : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
          ? (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              {
                id: 'loan-slik-checking',
                text: 'SLIK Checking',
              },
              {
                id: 'opinion',
                text: 'Opinion',
              },
              {
                id: 'compare-data',
                text: 'Compare Data',
              },
            ])
          : (this.subMenu = [...SUBMENU_LOAN_ANALYS_BELOW_AND_BTB]);
        break;

      case 'la-approval':
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
          ? (this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL])
          : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
          ? (this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL_BELOW])
          : (this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL_BTB]);
        break;

      case 'la-approval-inquiry':
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
          ? (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
              { id: 'opinion', text: 'Opinion' },

              { id: 'compare-data', text: 'Compare Data' },
            ])
          : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
          ? (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              { id: 'opinion', text: 'Opinion' },

              { id: 'compare-data', text: 'Compare Data' },
            ])
          : (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
              { id: 'opinion', text: 'Opinion' },

              { id: 'compare-data', text: 'Compare Data' },
            ]);
        break;
      case 'dar-final':
        this.subMenu =
          this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
            ? [...SUBMENU_LOAN_ANALYS_DAR_FINAL_ABOVE, { id: 'compare-data', text: 'Compare Data' }]
            : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
            ? [
                ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
                {
                  id: 'opinion',
                  text: 'Opinion',
                },
                {
                  id: 'covenant',
                  text: 'convenant & Document Checklist',
                },
                {
                  id: 'loan-facility-detail',
                  text: 'Loan Facility',
                },
                {
                  id: 'facility-mapping',
                  text: 'Collateral Mapping Facility',
                },
                { id: 'compare-data', text: 'Compare Data' },
              ]
            : [...SUBMENU_LOAN_ANALYS_DAR_FINAL, { id: 'compare-data', text: 'Compare Data' }];
        break;

      case 'dar-notif':
        this.subMenu =
          this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
            ? [...SUBMENU_LOAN_ANALYS_DAR_NOTIF_ABOVE, { id: 'compare-data', text: 'Compare Data' }]
            : [...SUBMENU_LOAN_ANALYS_DAR_FINAL, { id: 'compare-data', text: 'Compare Data' }];
        break;

      case 'dar-checker':
        this.subMenu =
          this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
            ? SUBMENU_LOAN_ANALYS_DAR_CHECKER_ABOVE
            : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
            ? SUBMENU_LOAN_ANALYS_DAR_CHECKER_BELOW
            : SUBMENU_LOAN_ANALYS_DAR_CHECKER;
        break;

      case 'loan-committee-approval':
        this.subMenu =
          this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
            ? [...SUBMENU_LOAN_COMMITTEE_APPROVAL_ABOVE, { id: 'compare-data', text: 'Compare Data' }]
            : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
            ? [
                ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
                {
                  id: 'opinion',
                  text: 'Opinion',
                },
                {
                  id: 'covenant',
                  text: 'convenant & Document Checklist',
                },
                {
                  id: 'loan-facility-detail',
                  text: 'Loan Facility',
                },
                {
                  id: 'facility-mapping',
                  text: 'Collateral Mapping Facility',
                },
                { id: 'compare-data', text: 'Compare Data' },
              ]
            : [...SUBMENU_LOAN_ANALYS_DAR_FINAL, { id: 'compare-data', text: 'Compare Data' }];
        break;

      case 'cc-checking':
        this.subMenu = SUBMENU_LOAN_ANALYS_CC_CHECKING;
        break;

      case 'cc-review':
      case 'cc-inquiry':
        this.subMenu = SUBMENU_LOAN_ANALYS_CC_REVIEW;
        break;

      case 'loan-analys-and-approval-monitoring':
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
          ? (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
              {
                id: 'opinion',
                text: 'Credit Opinion',
              },
              {
                id: 'loan-facility-detail',
                text: 'loan facility detail',
              },
              {
                id: 'convenant-tbo',
                text: 'Covenant & Document Checklist',
              },
              {
                id: 'facility-mapping',
                text: 'Collateral Facility Mapping',
              },
            ])
          : this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio'
          ? (this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              {
                id: 'opinion',
                text: 'Credit Opinion',
              },
              {
                id: 'loan-facility-detail',
                text: 'loan facility detail',
              },
              {
                id: 'convenant-tbo',
                text: 'Covenant & Document Checklist',
              },
              {
                id: 'facility-mapping',
                text: 'Collateral Facility Mapping',
              },
            ])
          : (this.subMenu = [...SUBMENU_LOAN_ANALYS_APPROVAL_MONITORING]);
        break;

      default:
        this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio'
          ? (this.subMenu = SUBMENU_LOAN_ANALYS)
          : (this.subMenu = SUBMENU_LOAN_ANALYS_BELOW_AND_BTB);
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
    this.lendingProgramParameter();
    this.lovProposalType();
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
    this.getBucketNameSummary();

    if (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' || this.creditProposal.statusId === 'CP_DAR_FINAL') {
      this.disabledData = false;
    }
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  private getTasks(): void {
    this.creditProposalProcessService.getTasks(this.id).subscribe(res => {
      this.tasks = res.body;
    });
  }

  public sendEmail() {
    this.creditProposalService.sendNotification(this.creditProposal.id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Send Email Success',
      });
    });
  }

  public processTask(task: IProcessTask): void {
    const dialogRef = this.dialog.open(TaskCommentDialogComponent, {
      width: '80vw',
      data: { processTask: task },
    });
    dialogRef.afterClosed().subscribe(_res => {
      if (_res) {
        this.resAttr = _res;
        this.resAttr.attr.idPosition = this.getLocStor('POS');

        if (
          this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
          this.creditProposal.attributes['approvalStatus'] === 'Reject' &&
          _res.caption === 'Approve'
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Dont press button Approve!',
          });
        } else if (
          (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
            this.creditProposal.attributes['approvalStatus'] === 'Approved as proposed' &&
            _res.caption === 'Reject') ||
          (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
            this.creditProposal.attributes['approvalStatus'] === 'Approved as condition' &&
            _res.caption === 'Reject')
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Dont press button Reject!',
          });
        } else if (
          (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
            this.creditProposal.attributes['approvalStatus'] !== 'Approved as condition' &&
            this.creditProposal.attributes['approvalStatus'] !== 'Approved as proposed' &&
            this.creditProposal.attributes['approvalStatus'] !== 'Reject' &&
            _res.caption === 'Reject') ||
          (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
            this.creditProposal.attributes['approvalStatus'] !== 'Approved as condition' &&
            this.creditProposal.attributes['approvalStatus'] !== 'Approved as proposed' &&
            this.creditProposal.attributes['approvalStatus'] !== 'Reject' &&
            _res.caption === 'Approve')
        ) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please press button approval status!',
            life: 3000,
          });
        } else if (this.creditProposal.statusId === 'CP_APPROVE_TO_LA') {
          this.validate()
            .then(() => {
              this.onSave('process');
            })
            .catch(() => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select Assignee before submit',
              });
            });
        } else {
          this.onSave('process');
        }
      }
    });
  }
  public lovProposalType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'PROPOSAL_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.proposType = res.body;
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

  private addNewNotes(positionVal: number, messageVal: any, recomendationVal: string, pathVal: string, typeVal: string): INotes {
    let note: INotes = new Notes();

    return (note = {
      applicationId: this.id,
      positionId: positionVal,
      message: messageVal,
      createDate: new Date().toISOString(),
      recomendation: recomendationVal,
      path: pathVal,
      type: typeVal,
    });
  }

  public onAssignTo(ev: any): void {
    let dynAttr = 'dataAssignTo';

    if (this.url === 'la-distribution') {
      dynAttr = 'dataAssignToCRO';
    } else if (this.url === 'cc-distribution') {
      dynAttr = 'dataAssignToCCAdmin';
    } else if (this.url === 'distribution') {
      dynAttr = 'dataAssignToLegalOfficer';
    }

    this.isAssignedTo = ev && true;
    this.applicationRole = ev;
    this.creditProposal.attributes[dynAttr] = ev;
  }

  public validate() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.isAssignedTo) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }

  public saveAssignTo() {
    if (this.applicationRole.id) {
      this.applicationRoleService.update(this.applicationRole).subscribe(res => {
        this.creditProposalService.find(this.activatedRoute.snapshot.data['loanAnalys'].id).subscribe((response: any) => {
          this.cp = response.body;
        });
      });
    } else {
      this.applicationRoleService.create(this.applicationRole).subscribe(res => {
        this.creditProposalService.find(this.activatedRoute.snapshot.data['loanAnalys'].id).subscribe((response: any) => {
          this.cp = response.body;
        });
      });
    }
  }

  private saveApplicationRole(source: string): void {
    if (this.creditProposalCollateralInfoComponent) {
      this.creditProposalCollateralInfoComponent.triggeredSave(this.creditProposal.attributes.proposalType);
    }

    if (source === 'process') {
      this.creditProposalProcessService.processTask(this.resAttr).subscribe(res => {
        this.router.navigate([this.router.url.split('/')[1]]);
      });
    } else if (source === 'default') {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });
    }

    /* if (this.applicationRole.id) {
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
    } */
  }

  public userId: any;
  public InternalId: any;
  public positionApproval: any;

  private preSave(status: string): ICreditProposal {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    const applicationRolePreSave = {
      id: 0,
      applicationId: 0,
      partyId: '',
      partyName: '',
      roleDescription: '',
      roleId: '',
    };

    applicationRolePreSave.id = Number(this.applicationRole.id);
    applicationRolePreSave.applicationId = Number(this.applicationRole.applicationId);
    applicationRolePreSave.partyId = this.applicationRole.partyId;
    applicationRolePreSave.partyName = this.applicationRole.partyName;
    applicationRolePreSave.roleId = this.applicationRole.roleId;
    applicationRolePreSave.roleDescription = this.applicationRole.roleDescription;

    const tempRouter = this.router.url.split('/')[1];

    if (tempRouter === 'cc-review') {
      if (this.opinionType === 'compliance') {
        if (this.positionLoginFromEmit) {
          let tempHelper = 0;
          let tempOpinionType = '';

          tempOpinionType = 'compliance';

          if (copyCreditProposal.notes.length > 0) {
            for (let i = 0; i < copyCreditProposal.notes.length; i++) {
              if (copyCreditProposal.notes[i].positionId === this.positionLoginFromEmit) {
                copyCreditProposal.notes[i].applicationId = this.id;
                copyCreditProposal.notes[i].message = '';
                copyCreditProposal.notes[i].recomendation = this.recomendation;
                copyCreditProposal.notes[i].path = this.uuidPath;
                copyCreditProposal.notes[i].type = tempOpinionType;
                tempHelper = tempHelper + 1;
              }
            }

            if (tempHelper === 0) {
              copyCreditProposal.notes.push(
                this.addNewNotes(this.positionLoginFromEmit, '', this.recomendation, this.uuidPath, tempOpinionType)
              );
            }
          } else {
            copyCreditProposal.notes.push(
              this.addNewNotes(this.positionLoginFromEmit, '', this.recomendation, this.uuidPath, tempOpinionType)
            );
          }
        }
      }
    }

    if (status === 'complete') {
      if (
        tempRouter === 'la-analyst' ||
        tempRouter === 'la-SME-CRC' ||
        tempRouter === 'la-approval' ||
        tempRouter === 'loan-committee-approval'
      ) {
        if (this.id && this.positionLoginFromEmit && this.recomendation && this.uuidPath) {
          let tempHelper = 0;
          let tempOpinionType = '';

          tempOpinionType = tempRouter === 'loan-committee-approval' ? 'loan_committee' : 'loan_analysis';

          if (copyCreditProposal.notes.length > 0) {
            for (let i = 0; i < copyCreditProposal.notes.length; i++) {
              if (copyCreditProposal.notes[i].positionId === this.positionLoginFromEmit) {
                copyCreditProposal.notes[i].applicationId = this.id;
                copyCreditProposal.notes[i].message = '';
                copyCreditProposal.notes[i].recomendation = this.recomendation;
                copyCreditProposal.notes[i].path = this.uuidPath;
                copyCreditProposal.notes[i].type = tempOpinionType;
                tempHelper = tempHelper + 1;
              }
            }

            if (tempHelper === 0) {
              copyCreditProposal.notes.push(
                this.addNewNotes(this.positionLoginFromEmit, '', this.recomendation, this.uuidPath, tempOpinionType)
              );
            }
          } else {
            copyCreditProposal.notes.push(
              this.addNewNotes(this.positionLoginFromEmit, '', this.recomendation, this.uuidPath, tempOpinionType)
            );
          }
        }
      }
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
    copyCreditProposal.attributes['calculationExposure'] = JSON.stringify(copyCreditProposal.attributes['calculationExposure']);
    copyCreditProposal.attributes['approvalStatus'] = JSON.stringify(copyCreditProposal.attributes['approvalStatus']);
    copyCreditProposal.attributes['dataAssignTo'] = JSON.stringify(copyCreditProposal.attributes['dataAssignTo']);

    if (this.url === 'la-distribution') {
      copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(applicationRolePreSave);
      copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    } else if (this.url === 'cc-distribution') {
      copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
      copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(applicationRolePreSave);
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    } else if (this.url === 'distribution') {
      copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
      copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(applicationRolePreSave);
    } else {
      copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
      copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    }

    copyCreditProposal.attributes['coverageTotal'] = JSON.stringify(copyCreditProposal.attributes['coverageTotal']);
    copyCreditProposal.attributes['lendingProgramParameter'] = JSON.stringify(copyCreditProposal.attributes['lendingProgramParameter']);

    if (copyCreditProposal.prospectPerson) {
      copyCreditProposal.prospectPerson.dob = this.creditProposalStartState.prospectPerson.dob;
    }

    return copyCreditProposal;
  }

  public onClickRed(): void {
    this.parentSubject.next('red-clicked');
  }

  setUuidPath(newItem: string) {
    this.uuidPath = newItem;
  }

  setUuidPathCompliance(newItem: string) {
    this.uuidPath = newItem;
  }

  setOpinionRecomendation(newItem: string) {
    this.recomendation = newItem;
  }

  setPositionLogin(newItem: number) {
    this.positionLoginFromEmit = newItem;
  }

  setPositionLoginCompliance(newItem: number) {
    this.positionLoginFromEmit = newItem;
  }

  setTypeOpinion(type: string) {
    this.opinionType = type;
  }

  setOpinionFileSfdt(file: File) {
    this.opinionFileSfdt = file;
  }

  setOpinionFileWord(file: File) {
    this.opinionFileWord = file;
  }

  setConditionFileSfdt(file: File) {
    this.conditionFileSfdt = file;
  }

  setConditionFileWord(file: File) {
    this.conditionFileWord = file;
  }

  setIsAllowSave(status: boolean) {
    const statusPreSave = status ? 'complete' : 'not-complete';

    if (this.creditProposal.id) {
      let isAllowedSaveWith2StepVerification = false;
      if (
        this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
        (this.parentPath === 'la-analyst' ||
          this.parentPath === 'la-SME-CRC' ||
          this.parentPath === 'la-approval' ||
          this.parentPath === 'loan-committee-approval')
      ) {
        isAllowedSaveWith2StepVerification = this.twoStepVerificationOpinionRadio();
      } else {
        isAllowedSaveWith2StepVerification = true;
      }

      if (isAllowedSaveWith2StepVerification) {
        this.creditProposalService.update(this.preSave(statusPreSave)).subscribe(res => {
          this.creditProposal.notes = res.body.notes;

          if (this.loanAnalysOpinionComponent) {
            this.loanAnalysOpinionComponent.refresh();
          }

          this.saveApplicationRole(this.saveState);
        });
      } else {
        if (this.recomendation) {
          this.messageService.add({
            severity: 'info',
            summary: 'Warning',
            detail:
              'System Failure at Opinion Menu! Please refresh the page, re-check progress you do at all menu exept Opinion Menu, & repeat what you do at Opinion Menu',
          });
        }
      }
    }
  }

  private saveFile(): void {
    const formDataOpinionSfdt = new FormData();
    const formDataOpinionWord = new FormData();

    const formDataConditionSfdt = new FormData();
    const formDataConditionWord = new FormData();

    const fileNameSfdt = this.uuidPath + '.sfdt';
    const fileNameWord = this.uuidPath + '.docs';
    const fileTypeSfdt = 'sfdt';
    const fileTypeWord = 'word';

    const keyOpinion = 'credit_proposal/remark/opinion-history/opinion';
    const pathHelperOpinion = this.uuidPath + '-opinion';
    const metaDataOpinionSfdt = {
      objectName: `${keyOpinion}/${this.id}/${pathHelperOpinion}/${fileTypeSfdt.replace('&', '')}/${fileNameSfdt}`,
    };
    const metaDataOpinionWord = {
      objectName: `${keyOpinion}/${this.id}/${pathHelperOpinion}/${fileTypeWord.replace('&', '')}/${fileNameWord}`,
    };

    const keyCondition = 'credit_proposal/remark/opinion-history/condition';
    const pathHelperCondition = this.uuidPath + '-condition';
    const metaDataConditionSfdt = {
      objectName: `${keyCondition}/${this.id}/${pathHelperCondition}/${fileTypeSfdt.replace('&', '')}/${fileNameSfdt}`,
    };
    const metaDataConditionWord = {
      objectName: `${keyCondition}/${this.id}/${pathHelperCondition}/${fileTypeWord.replace('&', '')}/${fileNameWord}`,
    };

    formDataOpinionSfdt.append('file', new File([this.opinionFileSfdt], fileNameSfdt));
    formDataOpinionWord.append('file', new File([this.opinionFileWord], fileNameWord));

    formDataConditionSfdt.append('file', new File([this.conditionFileSfdt], fileNameSfdt));
    formDataConditionWord.append('file', new File([this.conditionFileWord], fileNameWord));

    this.storageService.uploadMeta(this.BUCKET, formDataOpinionSfdt, metaDataOpinionSfdt).subscribe();
    this.storageService.uploadMeta(this.BUCKET, formDataOpinionWord, metaDataOpinionWord).subscribe();

    this.storageService.uploadMeta(this.BUCKET, formDataConditionSfdt, metaDataConditionSfdt).subscribe();
    this.storageService.uploadMeta(this.BUCKET, formDataConditionWord, metaDataConditionWord).subscribe();
  }

  private twoStepVerificationOpinionRadio() {
    let returnStat = false;

    if (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' && (this.parentPath === 'la-analyst' || this.parentPath === 'la-SME-CRC')) {
      if (
        this.recomendation === 'Recommend as Propose' ||
        this.recomendation === 'Recommend With Condition' ||
        this.recomendation === 'Not Recommend'
      ) {
        returnStat = true;
      }
    } else if (
      this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
      (this.parentPath === 'la-approval' || this.parentPath === 'loan-committee-approval')
    ) {
      if (
        this.recomendation === 'Approved as Propose' ||
        this.recomendation === 'Approved With Condition' ||
        this.recomendation === 'Not Approved'
      ) {
        returnStat = true;
      }
    }

    return returnStat;
  }

  private saveUpdate(status: string, source: string): void {
    if (status === 'not-complete-not-visit') {
      this.creditProposalService.update(this.preSave(status)).subscribe(res => {
        this.creditProposal.products = res.body.products;
        this.creditProposal.notes = res.body.notes;

        const tempRouterA = this.router.url.split('/')[1];

        if (tempRouterA === 'cc-review') {
          if (this.loanAnalysOpinionCompliancePartComponent) {
            this.loanAnalysOpinionCompliancePartComponent.triggeredSave();
            this.loanAnalysOpinionCompliancePartComponent.refresh();
            this.loanAnalysOpinionCompliancePartComponent.onCreate();
          }
        }

        if (this.selectedMenu === 'loan-facility') {
          if (this.loanFacilityDetailTempComponent) {
            this.loanFacilityDetailTempComponent.triggeredSave();
            this.loanFacilityDetailTempComponent.onCreate();
          }
        }

        this.saveDoc = true;
        this.saveApplicationRole(source);
      });
    } else {
      let isAllowedSaveWith2StepVerification = false;
      if (
        this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
        (this.parentPath === 'la-analyst' ||
          this.parentPath === 'la-SME-CRC' ||
          this.parentPath === 'la-approval' ||
          this.parentPath === 'loan-committee-approval')
      ) {
        isAllowedSaveWith2StepVerification = this.twoStepVerificationOpinionRadio();
      } else {
        isAllowedSaveWith2StepVerification = true;
      }

      if (isAllowedSaveWith2StepVerification) {
        this.creditProposalService.update(this.preSave(status)).subscribe(res => {
          this.creditProposal.products = res.body.products;
          this.creditProposal.notes = res.body.notes;

          if (status === 'complete') {
            this.saveFile();
          }

          const tempRouterA = this.router.url.split('/')[1];

          if (tempRouterA === 'cc-review') {
            if (this.loanAnalysOpinionCompliancePartComponent) {
              this.loanAnalysOpinionCompliancePartComponent.triggeredSave();
              this.loanAnalysOpinionCompliancePartComponent.refresh();
              this.loanAnalysOpinionCompliancePartComponent.onCreate();
            }
          }

          if (this.selectedMenu === 'loan-facility') {
            if (this.loanFacilityDetailTempComponent) {
              this.loanFacilityDetailTempComponent.triggeredSave();
              this.loanFacilityDetailTempComponent.onCreate();
            }
          }

          this.saveDoc = true;
          this.saveApplicationRole(source);
        });
      } else {
        if (this.recomendation) {
          this.messageService.add({
            severity: 'info',
            summary: 'Warning',
            detail:
              'System Failure at Opinion Menu! Please refresh the page, re-check progress you do at all menu exept Opinion Menu, & repeat what you do at Opinion Menu',
          });
        }
      }
    }
  }

  public onSave(source: string): void {
    this.saveState = source;

    for (let i = 0; i < this.creditProposalService.partySliks.length; i++) {
      this.creditProposal.sliks = [...this.creditProposal.sliks, this.creditProposalService.partySliks[i]];
    }

    if (this.creditProposal.id) {
      const tempRouter = this.router.url.split('/')[1];

      if (
        tempRouter === 'la-analyst' ||
        tempRouter === 'la-SME-CRC' ||
        tempRouter === 'la-approval' ||
        tempRouter === 'loan-committee-approval'
      ) {
        if (this.loanAnalysOpinionComponent) {
          this.loanAnalysOpinionComponent.triggeredSaveValidate();
        } else {
          let countValidate = 0;
          if (this.positionLoginFromEmit) {
            if (this.opinionFileSfdt && this.opinionFileWord) {
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const testSfdtFile = JSON.parse(fileReader.result as string);
                /* if (testSfdtFile.sections[0].blocks) {
				  if (testSfdtFile.sections[0].blocks.length > 0) {
					++countValidate;
				  }
				} else {
				  // toast opinion empty
				  this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Opinion Empty! All data will be save except data at tab opinion' });
				} */

                if (testSfdtFile.sections[0].blocks[0].inlines || testSfdtFile.sections[0].blocks[0].columnCount) {
                  if (testSfdtFile.sections[0].blocks[0].columnCount) {
                    if (testSfdtFile.sections[0].blocks[0].columnCount > 0) {
                      ++countValidate;
                    } else {
                      // toast opinion empty
                      this.messageService.add({
                        severity: 'info',
                        summary: 'Warning',
                        detail: 'Opinion Empty! All data will be save except data at tab opinion',
                      });
                    }
                  } else if (testSfdtFile.sections[0].blocks[0].inlines) {
                    let isEmpty = true;
                    testSfdtFile.sections[0].blocks.forEach(block => {
                      if (block.inlines) {
                        if (block.inlines.length > 0) {
                          isEmpty = false;
                        }
                      }
                    });

                    if (isEmpty) {
                      // toast opinion empty
                      this.messageService.add({
                        severity: 'info',
                        summary: 'Warning',
                        detail: 'Opinion Empty! All data will be save except data at tab opinion',
                      });
                    } else {
                      ++countValidate;
                    }

                    /* if (testSfdtFile.sections[0].blocks[0].inlines.length > 0) {
					  ++countValidate;
					} else {
					  // toast opinion empty
					  this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Opinion Empty! All data will be save except data at tab opinion' });
					} */
                  }
                } else {
                  // toast opinion empty
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Warning',
                    detail: 'Opinion Empty! All data will be save except data at tab opinion',
                  });
                }

                if (this.recomendation) {
                  ++countValidate;
                  if (this.recomendation === 'Recommend With Condition' || this.recomendation === 'Approved With Condition') {
                    if (this.conditionFileSfdt && this.conditionFileWord) {
                      const fileReaderCondition: FileReader = new FileReader();
                      fileReaderCondition.onload = (eCondition: any) => {
                        const testSfdtFileCondition = JSON.parse(fileReaderCondition.result as string);
                        /* if (testSfdtFileCondition.sections[0].blocks) {
						  if (testSfdtFileCondition.sections[0].blocks.length > 0) {
							++countValidate;
						  } else {
							// toast condition empty
							this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Condition Empty! All data will be save except data at tab opinion' });
						  }
						} else {
						  // toast condition empty
						  this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Condition Empty! All data will be save except data at tab opinion' });
						} */

                        if (
                          testSfdtFileCondition.sections[0].blocks[0].inlines ||
                          testSfdtFileCondition.sections[0].blocks[0].columnCount
                        ) {
                          if (testSfdtFileCondition.sections[0].blocks[0].columnCount) {
                            if (testSfdtFileCondition.sections[0].blocks[0].columnCount > 0) {
                              ++countValidate;
                            } else {
                              // toast condition empty
                              this.messageService.add({
                                severity: 'info',
                                summary: 'Warning',
                                detail: 'Condition Empty! All data will be save except data at tab opinion',
                              });
                            }
                          } else if (testSfdtFileCondition.sections[0].blocks[0].inlines) {
                            let isEmpty = true;
                            testSfdtFileCondition.sections[0].blocks.forEach(block => {
                              if (block.inlines) {
                                if (block.inlines.length > 0) {
                                  isEmpty = false;
                                }
                              }
                            });

                            if (isEmpty) {
                              // toast condition empty
                              this.messageService.add({
                                severity: 'info',
                                summary: 'Warning',
                                detail: 'Condition Empty! All data will be save except data at tab opinion',
                              });
                            } else {
                              ++countValidate;
                            }

                            /* if (testSfdtFileCondition.sections[0].blocks[0].inlines.length > 0) {
							  ++countValidate;
							} else {
							  // toast condition empty
							  this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Condition Empty! All data will be save except data at tab opinion' });
							} */
                          }
                        }

                        if (countValidate === 3) {
                          this.saveUpdate('complete', source);
                        } else {
                          this.saveUpdate('not-complete', source);
                        }
                      };
                      fileReaderCondition.readAsText(this.conditionFileSfdt);
                    }
                  } else {
                    if (countValidate === 2) {
                      this.saveUpdate('complete', source);
                    } else {
                      this.saveUpdate('not-complete', source);
                    }
                  }
                } else {
                  // toast recomendation empty
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Warning',
                    detail: 'Recommendation Empty! All data will be save except data at tab opinion',
                  });
                  this.saveUpdate('not-complete', source);
                }
              };
              fileReader.readAsText(this.opinionFileSfdt);
            } else {
              // toast opinion empty
              this.messageService.add({
                severity: 'info',
                summary: 'Warning',
                detail: 'Opinion Empty! All data will be save except data at tab opinion',
              });
              this.saveUpdate('not-complete', source);
            }
          } else {
            this.saveUpdate('not-complete-not-visit', source);
          }
        }
      } else {
        this.saveUpdate('not-complete-not-visit', source);
      }
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
    if (
      this.selectedMenu === 'loan-facility-detail' ||
      this.selectedMenu === 'loan-facility' ||
      this.selectedMenu === 'loan-facility-view'
    ) {
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
    if (this.selectedMenu === 'compliance-recommendation') {
      this.titleMenu = 'Compliance Recommendation';
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
    return this.titleMenu;
  }

  getTitleMenu(): void {
    this.appNameMenu = sessionStorage.getItem('appNameMenu');
  }

  // Generate Dar and SPPK

  private getBucketNameSummary() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];

      if (this.id) {
        this.KEYG += `/${this.id}/`;
      } else {
        console.warn('Param id not found');
      }

      this.onRefresh();
    });
  }

  private onRefresh(): void {
    const obj = {
      key: this.KEYG,
    };
    this.storageService
      .getObjects(this.BUCKET, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        const temp: any[] = response?.body;
        let i = 1;
        const data: any[] = [];
        temp.forEach((item: IObj) => {
          data.push({
            indexNum: i,
            key: item.key,
            appovallevel: item.name,
            fileName: item.name,
            metaData: item.metaData,
            sizeFile: formatBytes(item.size),
            tags: item.tags,
            url: item.url,
          });
          i++;
        });
        if (this.parentPath === 'loan-committee-approval' || this.parentPath === 'dar-final') {
          this.dataFileDar = data;
        }
        if (this.parentPath === 'cc-inquiry') {
          this.dataFileCompliance = data;
        }
      });
  }

  private generate(): void {
    this.generateFileSppkDar().then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File Generated Successfully',
      });
      this.onRefresh();
    });
  }

  private async generateFileSppkDar(): Promise<void> {
    if (
      this.parentPath === 'loan-committee-approval' ||
      this.parentPath === 'dar-checker' ||
      this.parentPath === 'dar-final' ||
      this.parentPath === 'dar-notif'
    ) {
      const fileDar = await firstValueFrom(
        this.http.get('/services/report/api/report/dar/pdf-word/' + this.id, { responseType: 'text', observe: 'response' })
      );
      const fileSPPK = await firstValueFrom(
        this.http.get('/services/report/api/report/spkk/pdf-word/' + this.id, { responseType: 'text', observe: 'response' })
      );
    }
    if (this.parentPath === 'cc-inquiry') {
      const fileCompliance = await firstValueFrom(
        this.http.get('/services/report/api/report/compliance/pdf-word/' + this.id, { responseType: 'text', observe: 'response' })
      );
    }
  }

  public lendingProgram = [];
  public valueCpLendingProgram: [];
  public lendingProgramParameter() {
    this.lendingProgramParameterService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.lendingProgram = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.lendingProgram.length; i++) {
          if (this.lendingProgram[i].id === this.creditProposal.attributes['lendingProgramParameter']) {
            this.valueCpLendingProgram = this.lendingProgram[i].description;
          }
        }
      });
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
      })
      .subscribe(res => {
        this.collateral = res.body;
        if (this.collateral.length > 0) {
          for (let i = 0; i < this.collateral.length; i++) {
            this.findCollateralProperty(this.collateral[i]);
          }
        }
      });
  }

  // find collateral property
  public findCollateralProperty(collateral: ICollateral): void {
    if (collateral.id) {
      this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
        this.collateralProperties = [...this.collateralProperties, ...res.body];
      });
    }
  }
}

interface IObj {
  key?: string;
  metaData?: any;
  fileName?: string;
  name?: string;
  size?: number;
  tags?: any;
  url?: string;
}
