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
  COLLATERAL_TYPE,
  DOCUMENT_TYPE_GENERATE_DOCUMENT,
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
import moment from 'moment';
import { CPFacilityTable, ICPFacilityTable } from '../credit-proposal/exposure/total-exposure/cp-facility-table-model';

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

  public collateralCgpg: ICollateral[] = [];
  public currencyMaster: number;
  public myBusinessGroupCPFacility: ICPFacilityTable[] = [];

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
  public isDarRevHistoryExist: boolean;
  public darRouter: boolean;

  public uuidPath: any;
  public recomendation: string;
  public positionLoginFromEmit: number;
  public applicationRoleFromEmit: any;
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

  private applicationRolePreSave = {
    id: 0,
    applicationId: 0,
    partyId: '',
    partyName: '',
    roleDescription: '',
    roleId: '',
  };

  public isOpen = false;

  private menuId = '';

  public isDocDar: boolean;
  dataFileLaDistrib: any[];
  dataFile: any;

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
    this.isDarRevHistoryExist = this.creditProposal.attributes.darRevHistory ? true : false;
    this.sourceSlikChecking = this.creditProposal.statusId === 'CP_ASSIGNMENT' ? 'edit' : 'loan';
    this.darRouter = this.router.url.split('/').indexOf('dar-notif') > -1;
    this.url = this.parentPath;

    switch (this.parentPath) {
      case 'la-distribution':
        this.menuId = 'LOAN_ANALYSIS_DISTRIBUTION';
        if (this.creditProposal.statusId === 'CP_APPROVE_TO_LA') {
          if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
            // Above
            if (this.creditProposal.attributes['previousOfferingLetter']) {
              this.subMenu = [...SUBMENU_LOAN_ANALYS_CP_SUMMARY, { id: 'memo-banding', text: 'Memo Banding' }];
            } else {
              this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY;
            }
          } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
            // Below
            if (this.creditProposal.attributes['previousOfferingLetter']) {
              this.subMenu = [...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW, { id: 'memo-banding', text: 'Memo Banding' }];
            } else {
              this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW;
            }
          } else {
            // BTB
            if (this.creditProposal.attributes['previousOfferingLetter']) {
              this.subMenu = [...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB, { id: 'memo-banding', text: 'Memo Banding' }];
            } else {
              this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB;
            }
          }
        } else {
          if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
            // Above
            if (this.creditProposal.attributes['previousOfferingLetter']) {
              this.subMenu = [
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
                {
                  id: 'memo-banding',
                  text: 'Memo Banding',
                },
              ];
            } else {
              this.subMenu = [
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
              ];
            }
          } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
            // Below
            if (this.creditProposal.attributes['previousOfferingLetter']) {
              this.subMenu = [
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
                {
                  id: 'memo-banding',
                  text: 'Memo Banding',
                },
              ];
            } else {
              this.subMenu = [
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
              ];
            }
          } else {
            // BTB
            if (this.creditProposal.attributes['previousOfferingLetter']) {
              this.subMenu = [
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
                {
                  id: 'memo-banding',
                  text: 'Memo Banding',
                },
              ];
            } else {
              this.subMenu = [
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
              ];
            }
          }
        }
        break;

      case 'la-SME-CRC':
        this.menuId = 'LOAN_ANALYSIS_SME_CREDIT_REVIEW_CHECKER';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
            ];
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
            ];
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
            ];
          }
        }

        break;

      case 'cc-distribution':
        this.menuId = 'COMPLIANCE_CHECKING_DISTRIBUTION';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_CP_SUMMARY, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY;
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW;
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB;
          }
        }

        break;

      case 'la-analyst':
        this.menuId = 'LOAN_ANALYSIS';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS;
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
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
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = [
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
            ];
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_BELOW_AND_BTB, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS_BELOW_AND_BTB;
          }
        }

        break;

      case 'la-approval':
        this.menuId = 'LOAN_APPROVAL';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL];
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL_BELOW, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL_BELOW];
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL_BTB, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_LA_APPROVAL_BTB];
          }
        }

        break;

      case 'la-approval-inquiry':
        this.menuId = 'LOAN_APPROVAL_INQUIRY';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
            ];
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
            ];
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
              { id: 'opinion', text: 'Opinion' },
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          }
        }

        break;

      case 'dar-final':
        this.menuId = 'DAR_FINALIZATION';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_DAR_FINAL_ABOVE,
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_DAR_FINAL_ABOVE, { id: 'compare-data', text: 'Compare Data' }];
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
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
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
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
            ];
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_DAR_FINAL,
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_DAR_FINAL, { id: 'compare-data', text: 'Compare Data' }];
          }
        }

        break;

      case 'dar-notif':
        this.menuId = 'DAR_NOTIFICATION';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_DAR_NOTIF_ABOVE,
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_DAR_NOTIF_ABOVE, { id: 'compare-data', text: 'Compare Data' }];
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              {
                id: 'opinion',
                text: 'Opinion',
              },
              {
                id: 'dar-convenant',
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
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW,
              {
                id: 'opinion',
                text: 'Opinion',
              },
              {
                id: 'dar-convenant',
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
            ];
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
              {
                id: 'opinion',
                text: 'Opinion',
              },
              {
                id: 'dar-convenant',
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
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_CP_SUMMARY_BELOW_AND_BTB,
              {
                id: 'opinion',
                text: 'Opinion',
              },
              {
                id: 'dar-convenant',
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
            ];
          }
        }

        break;

      case 'dar-checker':
        this.menuId = 'FINAL_DAR_CHECKER';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_DAR_CHECKER_ABOVE, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS_DAR_CHECKER_ABOVE;
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_DAR_CHECKER_BELOW, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS_DAR_CHECKER_BELOW;
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_DAR_CHECKER, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS_DAR_CHECKER;
          }
        }

        break;

      case 'loan-committee-approval':
        this.menuId = 'LOAN_KOMITE_APPROVAL';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_COMMITTEE_APPROVAL_ABOVE,
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [...SUBMENU_LOAN_COMMITTEE_APPROVAL_ABOVE, { id: 'compare-data', text: 'Compare Data' }];
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
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
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [
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
            ];
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_LOAN_ANALYS_DAR_FINAL,
              { id: 'compare-data', text: 'Compare Data' },
              { id: 'memo-banding', text: 'Memo Banding' },
            ];
          } else {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_DAR_FINAL, { id: 'compare-data', text: 'Compare Data' }];
          }
        }

        break;

      case 'cc-checking':
        this.menuId = 'COMPLIANCE_CHECKING';
        this.subMenu = this.creditProposal.attributes['previousOfferingLetter']
          ? [...SUBMENU_LOAN_ANALYS_CC_CHECKING, { id: 'memo-banding', text: 'Memo Banding' }]
          : SUBMENU_LOAN_ANALYS_CC_CHECKING;
        break;

      case 'cc-review':
        this.menuId = 'COMPLIANCE_CHECKING_REVIEW';
        this.subMenu = this.creditProposal.attributes['previousOfferingLetter']
          ? [...SUBMENU_LOAN_ANALYS_CC_REVIEW, { id: 'memo-banding', text: 'Memo Banding' }]
          : SUBMENU_LOAN_ANALYS_CC_REVIEW;
        break;

      case 'cc-inquiry':
        this.menuId = 'COMPLIANCE_CHECKING_INQUIRY';
        this.subMenu = this.creditProposal.attributes['previousOfferingLetter']
          ? [...SUBMENU_LOAN_ANALYS_CC_REVIEW, { id: 'memo-banding', text: 'Memo Banding' }]
          : SUBMENU_LOAN_ANALYS_CC_REVIEW;
        break;

      case 'loan-analys-and-approval-monitoring':
        this.menuId = 'LOAN_ANALYST_AND_APPROVAL_MONITORING';
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
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
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = [
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
            ];
          }
        } else if (this.creditProposal.attributes.proposalType === 'Total Exposure <= IDR 15 Bio') {
          // Below
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
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
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = [
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
            ];
          }
        } else {
          // BTB
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_APPROVAL_MONITORING, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_APPROVAL_MONITORING];
          }
        }

        break;

      default:
        if (this.creditProposal.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
          // Above
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS;
          }
        } else {
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [...SUBMENU_LOAN_ANALYS_BELOW_AND_BTB, { id: 'memo-banding', text: 'Memo Banding' }];
          } else {
            this.subMenu = SUBMENU_LOAN_ANALYS_BELOW_AND_BTB;
          }
        }

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
    this.cpGroub();
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
    this.loadByPartyId(this.creditProposal.cif.partyId);
  }
  private checkIsDoc() {
    if (this.dataFileDar.length > 0) {
      for (let i = 0; i < this.dataFileDar.length; i++) {
        if (
          this.dataFileDar[i].tags.documentType === DOCUMENT_TYPE_GENERATE_DOCUMENT.DAR ||
          this.dataFileDar[i].tags.documentType === DOCUMENT_TYPE_GENERATE_DOCUMENT.SPPK
        ) {
          this.isDocDar = true;
        } else {
          this.isDocDar = false;
        }
      }
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
    // this.creditProposalProcessService.getTasks(this.id).subscribe(res => {
    this.creditProposalProcessService.getTasksByPos(this.id, { idPosition: this.getLocStor('POS'), idMenu: this.menuId }).subscribe(res => {
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
          // } else if (
          //   (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
          //     this.creditProposal.attributes['approvalStatus'] !== 'Approved as condition' &&
          //     this.creditProposal.attributes['approvalStatus'] !== 'Approved as proposed' &&
          //     this.creditProposal.attributes['approvalStatus'] !== 'Reject' &&
          //     _res.caption === 'Reject') ||
          //   (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
          //     this.creditProposal.attributes['approvalStatus'] !== 'Approved as condition' &&
          //     this.creditProposal.attributes['approvalStatus'] !== 'Approved as proposed' &&
          //     this.creditProposal.attributes['approvalStatus'] !== 'Reject' &&
          //     _res.caption === 'Approve')
          // ) {
          //   this.messageService.add({
          //     severity: 'error',
          //     summary: 'Error',
          //     detail: 'Please press button approval status!',
          //     life: 3000,
          //   });
          // } else if (
          //   this.creditProposal.statusId === 'CP_DAR_FINAL' &&
          //   this.creditProposal.attributes['approvalStatus'] !== 'Approved as condition' &&
          //   this.creditProposal.attributes['approvalStatus'] !== 'Approved as proposed' &&
          //   this.creditProposal.attributes['approvalStatus'] !== 'Reject' &&
          //   _res.caption === 'Submit'
          // ) {
          //   this.messageService.add({
          //     severity: 'error',
          //     summary: 'Error',
          //     detail: 'Please press button approval status before submit!',
          //     life: 3000,
          //   });
        } else if (
          this.creditProposal.statusId === 'CP_DAR_FINAL' ||
          (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' && _res.caption === 'Approved as Condition') ||
          _res.caption === 'Approved as Proposed'
        ) {
          this.creditProposal.attributes['approvalStatus'] = task.caption;
          this.validateDar()
            .then(() => {
              this.onSave('process', _res.caption);
            })
            .catch(() => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please Generate DAR before Approved',
              });
            });
        } else if (this.creditProposal.statusId === 'CP_APPROVE_TO_LA' && _res.caption === 'Submit') {
          this.validate()
            .then(() => {
              this.onSave('process', _res.caption);
            })
            .catch(() => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select Assignee before submit',
              });
            });
        } else {
          this.onSave('process', _res.caption);
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

  private doCheckApplicationRolePreSave(): void {
    if (this.applicationRolePreSave) {
      if (
        !this.applicationRolePreSave.id ||
        this.applicationRolePreSave.id === 0 ||
        !this.applicationRolePreSave.applicationId ||
        this.applicationRolePreSave.applicationId === 0
      ) {
        if (this.url === 'la-distribution') {
          this.applicationRolePreSave = this.creditProposalStartState.attributes['dataAssignToCRO'];
        } else if (this.url === 'cc-distribution') {
          this.applicationRolePreSave = this.creditProposalStartState.attributes['dataAssignToCCAdmin'];
        } else if (this.url === 'distribution') {
          this.applicationRolePreSave = this.creditProposalStartState.attributes['dataAssignToLegalOfficer'];
        }
      }
    }
  }

  private preSave(status: string): ICreditProposal {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);

    this.applicationRolePreSave.id = Number(this.applicationRole.id);
    this.applicationRolePreSave.applicationId = Number(this.applicationRole.applicationId);
    this.applicationRolePreSave.partyId = this.applicationRole.partyId;
    this.applicationRolePreSave.partyName = this.applicationRole.partyName;
    this.applicationRolePreSave.roleId = this.applicationRole.roleId;
    this.applicationRolePreSave.roleDescription = this.applicationRole.roleDescription;

    const tempRouter = this.router.url.split('/')[1];

    if (tempRouter === 'cc-review') {
      if (this.opinionType === 'compliance') {
        if (this.positionLoginFromEmit) {
          let tempHelper = 0;
          let tempOpinionType = '';

          tempOpinionType = 'compliance';

          if (copyCreditProposal.notes.length > 0) {
            for (let i = 0; i < copyCreditProposal.notes.length; i++) {
              if (Number(copyCreditProposal.notes[i].positionId) === Number(this.positionLoginFromEmit)) {
                if (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' || this.parentPath === 'loan-committee-approval') {
                  copyCreditProposal.notes[i].applicationId = this.id;
                  copyCreditProposal.notes[i].message = '';
                  copyCreditProposal.notes[i].recomendation = this.recomendation;
                  copyCreditProposal.notes[i].path = this.uuidPath;
                  copyCreditProposal.notes[i].createDate = moment(new Date(Date.now())).format();
                  copyCreditProposal.notes[i].type = tempOpinionType;
                  tempHelper = tempHelper + 1;
                } else {
                  copyCreditProposal.notes[i].applicationId = this.id;
                  copyCreditProposal.notes[i].message = '';
                  copyCreditProposal.notes[i].recomendation = this.recomendation;
                  copyCreditProposal.notes[i].path = this.uuidPath;
                  copyCreditProposal.notes[i].type = tempOpinionType;
                  tempHelper = tempHelper + 1;
                }
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
              if (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' || this.parentPath === 'loan-committee-approval') {
                if (
                  copyCreditProposal.notes[i].positionTypeId === this.applicationRoleFromEmit.roleId &&
                  copyCreditProposal.notes[i].partyId === this.applicationRoleFromEmit.partyId
                ) {
                  copyCreditProposal.notes[i].applicationId = this.id;
                  copyCreditProposal.notes[i].message = '';
                  // copyCreditProposal.notes[i].recomendation = this.recomendation;
                  copyCreditProposal.notes[i].recomendation = this.twoStepVerificationOpinionRadioRetVal();
                  copyCreditProposal.notes[i].path = this.uuidPath;
                  copyCreditProposal.notes[i].updateAction = true;
                  copyCreditProposal.notes[i].type = tempOpinionType;
                  tempHelper = tempHelper + 1;
                }
              } else {
                if (Number(copyCreditProposal.notes[i].positionId) === Number(this.positionLoginFromEmit)) {
                  copyCreditProposal.notes[i].applicationId = this.id;
                  copyCreditProposal.notes[i].message = '';
                  // copyCreditProposal.notes[i].recomendation = this.recomendation;
                  copyCreditProposal.notes[i].recomendation = this.twoStepVerificationOpinionRadioRetVal();
                  copyCreditProposal.notes[i].path = this.uuidPath;
                  copyCreditProposal.notes[i].updateAction = true;
                  copyCreditProposal.notes[i].type = tempOpinionType;
                  tempHelper = tempHelper + 1;
                }
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
    copyCreditProposal.attributes['collateralGroup'] = JSON.stringify(copyCreditProposal.attributes['collateralGroup']);

    this.doCheckApplicationRolePreSave();

    if (this.url === 'la-distribution') {
      copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(this.applicationRolePreSave);
      copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    } else if (this.url === 'cc-distribution') {
      copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
      copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(this.applicationRolePreSave);
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    } else if (this.url === 'distribution') {
      copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
      copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(this.applicationRolePreSave);
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

  private refractorSaveForIsAllowSave(statusPreSave: string): void {
    this.creditProposalService.update(this.preSave(statusPreSave)).subscribe(res => {
      this.creditProposal.notes = res.body.notes;

      this.loanAnalysOpinionComponent.refresh();

      // if (this.loanAnalysOpinionComponent) {
      // this.loanAnalysOpinionComponent.refresh();
      // }

      this.saveApplicationRole(this.saveState);
    });
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

  setApplicationRole(newItem: any) {
    this.applicationRoleFromEmit = newItem;
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

    const tempRouter = this.router.url.split('/')[1];

    const laData = this.creditProposal.notes.filter(note => note.type === 'loan_analysis');
    const lcaData = this.creditProposal.notes.filter(note => note.type === 'loan_committee');

    if (this.creditProposal.id) {
      if (this.saveState === 'default') {
        if (statusPreSave === 'complete') {
          this.refractorSaveForIsAllowSave(statusPreSave);
        } else {
          // message ada remark / recommendation kosong
          this.messageService.add({
            severity: 'info',
            summary: 'Warning',
            detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
          });
        }
      } else {
        if (tempRouter === 'loan-committee-approval') {
          if (lcaData.length > 0) {
            let nullEmptyHelper = 0;

            for (let i = 0; i < lcaData.length; i++) {
              if (lcaData[i]['recomendation'] === '' || lcaData[i]['recomendation'] === null) {
                ++nullEmptyHelper;
              }
            }

            if (nullEmptyHelper > 0) {
              // message data kosong, isi dulu
              this.messageService.add({
                severity: 'info',
                summary: 'Warning',
                detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
              });
            } else {
              this.refractorSaveForIsAllowSave(statusPreSave);
            }
          }
        } else if (tempRouter === 'la-analyst' || tempRouter === 'la-SME-CRC' || tempRouter === 'la-approval') {
          if (laData.length > 0) {
            const laDataSelf = laData.filter(note => Number(note.positionId) === Number(this.getLocStor('POS')));

            if (laDataSelf.length === 1) {
              if (laDataSelf['recomendation'] === '' || laDataSelf['recomendation'] === null) {
                // message data kosong, isi dulu
                this.messageService.add({
                  severity: 'info',
                  summary: 'Warning',
                  detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
                });
              } else {
                this.refractorSaveForIsAllowSave(statusPreSave);
              }
            } else {
              // message data kosong, isi dulu
              this.messageService.add({
                severity: 'info',
                summary: 'Warning',
                detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
              });
            }
          } else {
            // message data kosong, isi dulu
            this.messageService.add({
              severity: 'info',
              summary: 'Warning',
              detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
            });
          }
        } else {
          this.refractorSaveForIsAllowSave(statusPreSave);
        }
      }
    }
  }

  /* private saveFile(): void {
    const formDataOpinionSfdt = new FormData();
    const formDataOpinionWord = new FormData();

    const formDataConditionSfdt = new FormData();
    const formDataConditionWord = new FormData();

    // const fileNameSfdt = this.uuidPath + '.sfdt';
    // const fileNameWord = this.uuidPath + '.docs';
    const fileNameOpinionSfdt = 'opini.sfdt';
    const fileNameOpinionWord = 'opini.docs';
    const fileNameConditionSfdt = 'condition.sfdt';
    const fileNameConditionWord = 'condition.docs';
    const fileTypeSfdt = 'sfdt';
    const fileTypeWord = 'word';

    const keyOpinion = 'credit_proposal/remark/opinion-history/opinion';
    const pathHelperOpinion = this.uuidPath + '-opinion';
    const metaDataOpinionSfdt = {
      objectName: `${keyOpinion}/${this.id}/${pathHelperOpinion}/${fileTypeSfdt.replace('&', '')}/${fileNameOpinionSfdt}`,
    };
    const metaDataOpinionWord = {
      objectName: `${keyOpinion}/${this.id}/${pathHelperOpinion}/${fileTypeWord.replace('&', '')}/${fileNameOpinionWord}`,
    };

    const keyCondition = 'credit_proposal/remark/opinion-history/condition';
    const pathHelperCondition = this.uuidPath + '-condition';
    const metaDataConditionSfdt = {
      objectName: `${keyCondition}/${this.id}/${pathHelperCondition}/${fileTypeSfdt.replace('&', '')}/${fileNameConditionSfdt}`,
    };
    const metaDataConditionWord = {
      objectName: `${keyCondition}/${this.id}/${pathHelperCondition}/${fileTypeWord.replace('&', '')}/${fileNameConditionWord}`,
    };

    formDataOpinionSfdt.append('file', new File([this.opinionFileSfdt], fileNameOpinionSfdt));
    formDataOpinionWord.append('file', new File([this.opinionFileWord], fileNameOpinionWord));

    formDataConditionSfdt.append('file', new File([this.conditionFileSfdt], fileNameConditionSfdt));
    formDataConditionWord.append('file', new File([this.conditionFileWord], fileNameConditionWord));

    this.storageService.uploadMeta(this.BUCKET, formDataOpinionSfdt, metaDataOpinionSfdt).subscribe();
    this.storageService.uploadMeta(this.BUCKET, formDataOpinionWord, metaDataOpinionWord).subscribe();

    this.storageService.uploadMeta(this.BUCKET, formDataConditionSfdt, metaDataConditionSfdt).subscribe();
    this.storageService.uploadMeta(this.BUCKET, formDataConditionWord, metaDataConditionWord).subscribe();
  } */

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

  private twoStepVerificationOpinionRadioRetVal() {
    let returnVal = '';
    returnVal = this.recomendation;

    if (this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' && (this.parentPath === 'la-analyst' || this.parentPath === 'la-SME-CRC')) {
      if (
        this.recomendation === 'Approved as Propose' ||
        this.recomendation === 'Approved With Condition' ||
        this.recomendation === 'Not Approved'
      ) {
        if (this.recomendation === 'Approved as Propose') {
          returnVal = 'Recommend as Propose';
        } else if (this.recomendation === 'Approved With Condition') {
          returnVal = 'Recommend With Condition';
        } else if (this.recomendation === 'Not Approved') {
          returnVal = 'Not Recommend';
        }
      }
    } else if (
      this.creditProposal.statusId === 'CP_LOAN_COMMITTEE' &&
      (this.parentPath === 'la-approval' || this.parentPath === 'loan-committee-approval')
    ) {
      if (
        this.recomendation === 'Recommend as Propose' ||
        this.recomendation === 'Recommend With Condition' ||
        this.recomendation === 'Not Recommend'
      ) {
        if (this.recomendation === 'Recommend as Propose') {
          returnVal = 'Approved as Propose';
        } else if (this.recomendation === 'Recommend With Condition') {
          returnVal = 'Approved With Condition';
        } else if (this.recomendation === 'Not Recommend') {
          returnVal = 'Not Approved';
        }
      }
    }

    return returnVal;
  }

  private saveUpdate(status: string, source: string): void {
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

    /* if (status === 'not-complete-not-visit') {
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
    } else { */
    /* let isAllowedSaveWith2StepVerification = false;
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
      } */

    /* this.creditProposalService.update(this.preSave(status)).subscribe(res => {
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
	  }); */
    /* } */
  }

  public onSave(source: string, caption: string): void {
    this.saveState = source;
    for (let i = 0; i < this.creditProposalService.partySliks.length; i++) {
      this.creditProposal.sliks = [...this.creditProposal.sliks, this.creditProposalService.partySliks[i]];
    }

    if (this.creditProposal.id) {
      const tempRouter = this.router.url.split('/')[1];

      const laData = this.creditProposal.notes.filter(note => note.type === 'loan_analysis');

      const lcaData = this.creditProposal.notes.filter(note => note.type === 'loan_committee');
      if (source === 'default') {
        if (this.loanAnalysOpinionComponent) {
          if (tempRouter === 'loan-committee-approval') {
            if (this.applicationRoleFromEmit) {
              this.loanAnalysOpinionComponent.triggeredSaveValidate(source);
            } else {
              this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Please check Approval User Selection' });
            }
          } else {
            this.loanAnalysOpinionComponent.triggeredSaveValidate(source);
          }
        } else {
          this.saveUpdate('not-complete-not-visit', source);
        }
      } else if (source === 'process') {
        if (!caption.includes('return') && !caption.includes('Return')) {
          // validasi
          if (tempRouter === 'loan-committee-approval') {
            if (this.loanAnalysOpinionComponent) {
              this.loanAnalysOpinionComponent.triggeredSaveValidate(source);
            } else {
              if (lcaData.length > 0) {
                let nullEmptyHelper = 0;

                for (let i = 0; i < lcaData.length; i++) {
                  if (lcaData[i]['recomendation'] === '' || lcaData[i]['recomendation'] === null) {
                    ++nullEmptyHelper;
                  }
                }

                if (nullEmptyHelper !== 0) {
                  // message data kosong, isi dulu balik
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Warning',
                    detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
                  });
                } else {
                  this.saveUpdate('complete-not-visit', source);
                }
              }
            }
          } else if (tempRouter === 'la-analyst' || tempRouter === 'la-SME-CRC' || tempRouter === 'la-approval') {
            if (this.loanAnalysOpinionComponent) {
              this.loanAnalysOpinionComponent.triggeredSaveValidate(source);
            } else {
              if (laData.length > 0) {
                const laDataSelf = laData.filter(note => Number(note.positionId) === Number(this.getLocStor('POS')));

                if (laDataSelf.length === 1) {
                  if (laDataSelf['recomendation'] === '' || laDataSelf['recomendation'] === null) {
                    // message data kosong, isi dulu
                    this.messageService.add({
                      severity: 'info',
                      summary: 'Warning',
                      detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
                    });
                  } else {
                    this.saveUpdate('complete-not-visit', source);
                  }
                } else {
                  // message data kosong, isi dulu
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Warning',
                    detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
                  });
                }
              } else {
                // message data kosong, isi dulu
                this.messageService.add({
                  severity: 'info',
                  summary: 'Warning',
                  detail: 'Please input Opinion, Recommendation, Condition first before submit or save the data',
                });
              }
            }
          } else {
            this.saveUpdate('not-complete-not-visit', source);
          }
        } else {
          this.saveUpdate('complete-not-visit', source);
        }
      }
    }
    this.saveWord = true;
    this.saveWordOpinionCondition = true;
    this.cekCgpgData();
  }

  public getTitle(): void {
    this.appName = sessionStorage.getItem('appName');
  }

  getText(value: any): string {
    if (value === 'la-distribution') {
      return 'Loan Analysis Distribution';
    }
    if (value === 'la-analyst') {
      return 'Loan Analysis';
    }
    if (value === 'la-SME-CRC') {
      return 'Loan Analysis SME Checker';
    }
    if (value === 'la-approval') {
      return 'Loan Approval';
    }
    if (value === 'la-approval-inquiry') {
      return 'Loan Approval Inquiry';
    }
    if (value === 'dar-final') {
      return 'DAR Finalization';
    }
    if (value === 'dar-checker') {
      return 'Final DAR - Checker';
    }
    if (value === 'loan-committee-approval') {
      return 'Loan Komite Approval';
    }
    if (value === 'dar-notif') {
      return 'DAR Notification';
    }
    if (value === 'cc-distribution') {
      return 'Compliance Checking Distribution';
    }
    if (value === 'cc-checking') {
      return 'Compliance Checking';
    }
    if (value === 'cc-review') {
      return 'Compliance Checking Review';
    }
    if (value === 'cc-inquiry') {
      return 'Compliance Checking';
    } else {
      return 'Loan Analyst and Approval Monitoring';
    }
  }

  public getTitleUrl(): void {
    const x = this.router.url.split('/')[3];
    this.titleUrl = x;
  }

  showTextMenu() {
    if (this.subMenu.length > 1) {
      const menuList = [];
      menuList.push(this.subMenu);
      for (let i = 0; i < menuList.length; i++) {
        for (let x = 0; x < menuList[i].length; x++) {
          if (this.selectedMenu === menuList[i][x].id) {
            return menuList[i][x].text;
          } else {
            for (let y = 0; y < menuList[i][x].child?.length; y++) {
              if (this.selectedMenu === menuList[i][x].child[y].id) {
                return menuList[i][x].child[y].text;
              }
            }
          }
        }
      }
    }
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
        if (this.parentPath === 'la-distribution') {
          this.dataFileLaDistrib = data;
        }
      });
  }
  public validateDar() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.isDocDar) {
        resolve(true);
      } else {
        reject(false);
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
      this.isDocDar = true;
      const fileDar = await firstValueFrom(
        this.http.get('/services/report/api/report/dar/pdf-word/' + this.id, { responseType: 'text', observe: 'response' })
      );
      const fileSPPK = await firstValueFrom(
        this.http.get('/services/report/api/report/spkk/pdf-word/' + this.id, { responseType: 'text', observe: 'response' })
      );
    }
    if (this.parentPath === 'la-distribution') {
      const fileLadist = await firstValueFrom(
        this.http.get('/services/report/api/report/credit-proposal_v2/pdf-word/' + this.id, { responseType: 'text', observe: 'response' })
      );
    }
    if (this.parentPath === 'cc-inquiry') {
      const fileCompliance = await firstValueFrom(
        this.http.get('/services/report/api/report/compliance/pdf-word/' + this.id, { responseType: 'text', observe: 'response' })
      );
    }
  }
  // delete data from child
  public getDataDar(data: any): void {
    this.dataFile = data;
    for (let i = 0; i < this.dataFileDar.length; i++) {
      if (
        this.dataFileDar[i].tags.documentType === DOCUMENT_TYPE_GENERATE_DOCUMENT.DAR ||
        this.dataFileDar[i].tags.documentType === DOCUMENT_TYPE_GENERATE_DOCUMENT.SPPK
      ) {
        this.isDocDar = false;
      }
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

  public findCollateralProperty(collateral: ICollateral): void {
    if (collateral.id) {
      this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
        this.collateralProperties = [...this.collateralProperties, ...res.body];
      });
      if (collateral.collateralTypeId === COLLATERAL_TYPE['personalCorporateGuarantee']) {
        this.collateralCgpg.push(collateral);
      }
    }
  }

  public cekCgpgData() {
    if (this.collateralCgpg.length > 0) {
      for (let i = 0; i < this.collateralCgpg.length; i++) {
        const collateral = this.collateralProperties.find(obj => obj.collateralId === this.collateralCgpg[i].id && obj.external === false);
        if (collateral) {
          this.saveCollateralProperty(collateral);
        }
      }
    }

    // for (let i = 0; i < this.collateralProperties.length; i++) {
    //   if (this.collateralProperties[i].propertyType === 'GENERAL') {
    //     this.saveCollateralProperty(this.collateralProperties[i]);
    //   }
    // }
  }

  public saveCollateralProperty(property: ICollateralProperty) {
    this.collateralPropertyService.save(property).subscribe(res => {});
  }
  public triggerToggle() {
    this.isOpen = !this.isOpen;
  }

  public cpGroub() {
    let data = 0;
    const setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyMaster = res.body[0]?.factor;
    });
    this.creditProposalService.applicationGroubProduct(this.id).subscribe((response: any) => {
      this.filterBusinessGroupDebtorData(response.body);
      data = this.countTotalPsrGroup();
      this.creditProposal.attributes['calculationExposure'].totalPsrGroupNew = data;
      this.creditProposal.attributes['calculationExposure'].totalPsrGroup = data;
    });
  }

  private filterBusinessGroupDebtorData(source: any[]): void {
    if (source.length > 0) {
      let no = 0;
      for (let y = 0; y < source.length; y++) {
        const parsed = new CPFacilityTable();
        no = no + 1;
        parsed.no = no;
        parsed.GroupName = source[y].customerName;
        parsed.LoanAccount = source[y].agreementNumber;
        parsed.FacilityType = source[y].productTypeId;
        parsed.InitialLimit = Number(source[y].contractAmount ? source[y].contractAmount : 0);
        parsed.Changes = 0;
        parsed.OS = source[y].outstanding;
        parsed.TotalPlafond = source[y].productRevolving ? parsed.InitialLimit + parsed.Changes : source[y].outstanding;

        parsed.InterestRate =
          source[y].intResetFrequency + ' ' + source[y].intResetPeriod + ' ' + source[y].rateTypeName + ' ' + source[y].spreadRate;
        parsed.Provision = source[y].provisionFeeAmount;
        parsed.AdminFee = source[y].provisionFeeAmount;
        parsed.FirstDisbursementDate = source[y].trxDate;
        parsed.Tenor = source[y].trxDate;
        parsed.CCY = source[y].loanCurrency;
        parsed.MaturityDate = source[y].maturityDate;
        parsed.sublimit = source[y].subLimit;
        parsed.kurs = source[y].kurs;
        this.myBusinessGroupCPFacility = lodash.concat(this.myBusinessGroupCPFacility, parsed);
      }
    }
  }

  public countTotalPsrGroup() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.myBusinessGroupCPFacility.filter(obj => obj.sublimit === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.CCY === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.CCY !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].TotalPlafond !== undefined) {
            if (filterIdr[i].FacilityType === 'FX') {
              result = result + Number(filterIdr[i].TotalPlafond);
            }
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].TotalPlafond !== undefined) {
            if (filterUsd[i].FacilityType === 'FX') {
              dolar = dolar + Number(filterUsd[i].TotalPlafond) * Number(this.currencyMaster);
            }
          }
        }
      }
    }
    return result + dolar;
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
