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
  CP_APPROVAL_MENU_BTB,
  CP_APPROVAL_MENU_BELOW,
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
import { LendingProgramParameterService } from '../lending-program-parameter/lending-program-parameter.service';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import { StorageService } from '../storage/storage.service';
import { Subject } from 'rxjs';
import { ProposalBasicInformationViewComponent } from './basic-information/basic-information-view.component';
import moment from 'moment';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { ICollateral } from '../collateral/collateral.model';
import { CollateralService } from '../collateral/collateral.service';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { ProductClassificationService } from '../product-classification/product-classification.service';
import { MasterProductParameterService } from '../master-parameter/master-product/master-product-parameter.service';
import { TemplateService } from 'app/layouts/template/template.service';
import { IndustryLimitExposureParameterService } from '../master-parameter/industry-limit-exposure-parameter/industry-limit-exposure-parameter.service';
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

  @ViewChild('proposalBasicInformationViewComponent', {
    static: false,
  })
  proposalBasicInformationViewComponent: ProposalBasicInformationViewComponent;

  @ViewChild('creditProposaTabManagementInfoComponent', {
    static: false,
  })
  creditProposaTabManagementInfoComponent: CreditProposaTabManagementInfoComponent;

  @ViewChild('remaksComponent', {
    static: false,
  })
  remaksComponent: RemarskComponent;

  public listLoanType: any;
  private collateralProperties: ICollateralProperty[] = [];
  private collateral: ICollateral[] = [];
  private id: number;
  public clickedMenu: string;
  public tasks: IProcessTask[] = new Array<IProcessTask>();

  public creditProposal: ICreditProposal;
  public creditProposalStartState: ICreditProposal;

  public proposalType: object[];

  public segmentType: object[];

  public currentAccount: Account;

  public subMenu: object[];
  public uuidPath: any;
  public recomendation: string;
  public positionLogin: number;

  public url: string;
  public activeRoute: string;
  public applicationRole: IApplicationRole;
  public applicationRoles: IApplicationRole[];
  public applicationRoleId: number;
  public routeHelper: string;
  public resAttr: any;
  public lendingProgram = [];
  public isOpen = false;

  appName: any;
  appNameMenu: any;
  public title: string;
  public value: string;
  public titleUrl: any;
  public parentPath = this.router.url.split('/')[1];
  public isHistoryExist: boolean;
  public cp: ICreditProposal;
  public saveWord: Boolean = false;
  public saveWordOpinionCondition: Boolean = false;
  public dataChil: any;
  public proposType = [];
  public conditionSave: boolean;

  private BUCKET: string;
  public sectorIndustry = [];

  public opinionFileSfdt: File;
  public opinionFileWord: File;
  public conditionFileSfdt: File;
  public conditionFileWord: File;
  public positionTypeId: string;

  private saveState: string;
  public parentSubject: Subject<any> = new Subject();

  constructor(
    private creditProposalService: CreditProposalService,
    private creditProposalProcessService: CreditProposalProcessService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected messageService: MessageService,
    public dialog: MatDialog,
    protected reportUtils: ReportUtilService,
    public accountService: AccountService,
    public applicationRoleService: ApplicationRoleService,
    public lendingProgramParameterService: LendingProgramParameterService,
    public generalParameterService: GeneralParameterService,
    private storageService: StorageService,
    protected collateralService: CollateralService,
    protected collateralPropertyService: CollateralPropertyService,
    protected productClasificationService: ProductClassificationService,
    protected productParameterService: MasterProductParameterService,
    public templateService: TemplateService,
    public industryLimitExposureParameterService: IndustryLimitExposureParameterService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.creditProposalStartState = this.activatedRoute.snapshot.data['content'];
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
    this.isHistoryExist =
      this.creditProposal.attributes.previousHistory &&
      this.parentPath !== 'cp-status-approval' &&
      this.parentPath !== 'credit-proposal-status'
        ? true
        : false;
    this.setTotalPlafond();
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

  public setIndustryName() {
    const data = this.sectorIndustry.filter(
      industry => industry.industry === this.creditProposal.attributes['purposePricing'].industryCode
    );
    if (data.length > 0) {
      this.creditProposal.attributes['purposePricing'].industry = data[0].industryLabel;
    } else {
      this.creditProposal.attributes['purposePricing'].industry = '';
    }
  }

  public getListIndustry() {
    this.industryLimitExposureParameterService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.sectorIndustry = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  private getPositionTypeId(): void {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.positionTypeId = newPos.positionTypeId;
      this.conditionSaveBtn();
    });
  }
  public conditionSaveBtn() {
    if (this.router.url.includes('cp-status-approval')) {
      if (this.positionTypeId === 'BM') {
        if (this.creditProposal.statusId === 'CP_APPROVAL_BM') {
          this.conditionSave = true;
        } else {
          this.conditionSave = false;
        }
      }

      if (this.positionTypeId === 'SME_HEAD') {
        if (this.creditProposal.statusId === 'CP_APPROVAL_SME_HEAD') {
          this.conditionSave = true;
        } else {
          this.conditionSave = false;
        }
      }

      if (this.positionTypeId === 'SDH') {
        if (this.creditProposal.statusId === 'CP_APPROVAL_SDH') {
          this.conditionSave = true;
        } else {
          this.conditionSave = false;
        }
      }

      if (this.positionTypeId === 'DH') {
        if (this.creditProposal.statusId === 'CP_APPROVAL_DH') {
          this.conditionSave = true;
        } else {
          this.conditionSave = false;
        }
      }

      if (this.positionTypeId === 'DEPT_HEAD') {
        if (this.creditProposal.statusId === 'CP_APPROVAL_DEPTHEAD') {
          this.conditionSave = true;
        } else {
          this.conditionSave = false;
        }
      }
    } else {
      if (this.positionTypeId === 'RM') {
        if (
          this.creditProposal.statusId === 'DRAFT' ||
          this.creditProposal.statusId === 'CP_RETURN_TO_RM' ||
          this.creditProposal.statusId === 'CP_RETURN_TO_CR' ||
          this.creditProposal.statusId === 'RETURN_TO_RM_CRA' ||
          this.creditProposal.statusId === 'OL_APPEAL'
        ) {
          this.conditionSave = true;
        } else {
          this.conditionSave = false;
        }
      } else {
        this.conditionSave = false;
      }
    }
  }

  private getBucketNameSummary() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
    });
  }

  setUuidPath(newItem: string) {
    this.uuidPath = newItem;
  }

  setOpinionRecomendation(newItem: string) {
    this.recomendation = newItem;
  }

  setPositionLogin(posLog: number) {
    // this.positionLogin = posLog;
    this.positionLogin = this.getLocStor('POS');
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
      this.creditProposalService.update(this.preSave(statusPreSave)).subscribe(res => {
        this.creditProposal.notes = res.body.notes;

        if (this.creditProposalTabBusinessActivityComponent) {
          this.creditProposalTabBusinessActivityComponent.triggeredSaveAll();
        }

        /* if (this.creditProposalOpinionHistoryComponent) {
          this.creditProposalOpinionHistoryComponent.triggeredSave();
          this.creditProposalOpinionHistoryComponent.triggeredSaveCondition();
          this.creditProposalOpinionHistoryComponent.refresh();
          } */

        if (this.CreditProposalTabSummaryComponent) {
          this.CreditProposalTabSummaryComponent.triggeredSave();
        }

        if (this.parentPath !== 'cp-status-approval') {
          if (this.proposalBasicInformationViewComponent) {
            this.proposalBasicInformationViewComponent.triggeredSave();
          }
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

        if (this.creditProposalOpinionHistoryComponent) {
          this.creditProposalOpinionHistoryComponent.refresh();
        }

        if (this.creditProposalOpinionHistoryComponent) {
          this.creditProposalOpinionHistoryComponent.refresh();
        }

        if (this.saveState === 'process') {
          if (this.parentPath === 'cp-status-approval') {
            this.saveApplicationRole();
          } else {
            this.creditProposalProcessService.processTask(this.resAttr).subscribe(() => {
              this.router.navigate([this.router.url.split('/')[1]]);
            });
          }
        } else if (this.saveState === 'default') {
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

  ngOnInit() {
    this.getListIndustry();
    this.lendingProgramParameter();
    this.getPositionTypeId();
    this.lovProposalType();
    this.getBucketNameSummary();

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
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
  }

  public setSubmenu(event: Object): void {
    if (event) {
      if (event === ID_GREATER_15_BN) {
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
      } else if (event === ID_LOWER_EQUAL_15_BN) {
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
      } else if (event === ID_BACK_TO_BACK) {
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
      if (this.creditProposal.attributes.proposalType === ID_GREATER_15_BN && this.creditProposal.attributes.proposalType !== undefined) {
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
        this.creditProposal.attributes.proposalType === ID_LOWER_EQUAL_15_BN &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = [
          {
            id: 'credit-proposal-approval',
            text: 'Credit Proposal Summary',
          },
          ...CP_APPROVAL_MENU_BELOW,
          {
            id: 'opinion',
            text: 'Opinion',
          },
        ];
        this.dataChil = 'child';
      } else if (
        this.creditProposal.attributes.proposalType === ID_BACK_TO_BACK &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = [
          {
            id: 'credit-proposal-approval',
            text: 'Credit Proposal Summary',
          },
          ...CP_APPROVAL_MENU_BTB,
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
      if (this.creditProposal.attributes.proposalType === ID_GREATER_15_BN && this.creditProposal.attributes.proposalType !== undefined) {
        this.subMenu = SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN;
      } else if (
        this.creditProposal.attributes.proposalType === ID_LOWER_EQUAL_15_BN &&
        this.creditProposal.attributes.proposalType !== undefined
      ) {
        this.subMenu = SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN;
      } else if (
        this.creditProposal.attributes.proposalType === ID_BACK_TO_BACK &&
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
      this.creditProposal.attributes.proposalType = ID_GREATER_15_BN;
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
      this.creditProposal.attributes.proposalType = ID_LOWER_EQUAL_15_BN;
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
      this.creditProposal.attributes.proposalType = ID_BACK_TO_BACK;
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
        this.resAttr.attr.idPosition = this.getLocStor('POS');
        let init = 0;
        let change = 0;

        if (this.creditProposal.products.length > 0) {
          for (let i = 0; i < this.creditProposal.products.length; i++) {
            init = init + Number(this.creditProposal.products[i].attributes.initialLimit);
            change = change + Number(this.creditProposal.products[i].attributes.changes);
          }
        }

        this.resAttr.attr['applicationType'] = this.creditProposal.applicationTypeId;
        this.resAttr.attr['proposalType'] = this.creditProposal.attributes.proposalType;

        this.save('process');
      }
    });
  }

  private addNewNotes(positionVal: number, messageVal: any, recomendationVal: string, pathVal: string): INotes {
    let note: INotes = new Notes();

    return (note = {
      applicationId: this.id,
      positionId: positionVal,
      message: messageVal,
      createDate: new Date().toISOString(),
      recomendation: recomendationVal,
      path: pathVal,
      type: 'credit_proposal',
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
  public a = [];
  public lovProposalType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'PROPOSAL_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.proposType = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.proposType.length; i++) {
          if (this.proposType[i].code === this.creditProposal.attributes['proposalType']) {
            this.a = this.proposType[i].value;
          }
        }
      });
  }

  public onClickRed(): void {
    this.parentSubject.next('red-clicked');
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

  private saveUpdate(status: string, source: string): void {
    this.creditProposalService.update(this.preSave(status)).subscribe(res => {
      this.creditProposal.products = res.body.products;
      this.creditProposal.collaterals = res.body.collaterals;

      if (status === 'complete') {
        this.saveFile();
      }

      if (this.creditProposalTabBusinessActivityComponent) {
        this.creditProposalTabBusinessActivityComponent.triggeredSaveAll();
      }

      /* if (this.creditProposalOpinionHistoryComponent) {
    this.creditProposalOpinionHistoryComponent.triggeredSave();
    this.creditProposalOpinionHistoryComponent.triggeredSaveCondition();
    this.creditProposalOpinionHistoryComponent.refresh();
    } */

      if (this.CreditProposalTabSummaryComponent) {
        this.CreditProposalTabSummaryComponent.triggeredSave();
      }

      if (this.parentPath !== 'cp-status-approval') {
        if (this.proposalBasicInformationViewComponent) {
          this.proposalBasicInformationViewComponent.triggeredSave();
        }
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

    this.cekCgpgData();
  }

  public save(source: string): void {
    this.setIndustryName();
    this.saveState = source;

    if (this.creditProposal.attributes.proposalType === null || this.creditProposal.attributes.proposalType === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Select Proposal Type',
      });
    } else {
      this.saveWord = true;

      if (this.creditProposal.id) {
        if (this.router.url.split('/')[1] === 'credit-proposal-status') {
          this.saveUpdate('not-complete', source);
        } else if (this.router.url.split('/')[1] === 'cp-status-approval') {
          if (this.creditProposalOpinionHistoryComponent) {
            this.creditProposalOpinionHistoryComponent.triggeredSaveValidate();
          } else {
            let countValidate = 0;
            if (this.positionLogin) {
              if (this.opinionFileSfdt && this.opinionFileWord) {
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e: any) => {
                  const testSfdtFile = JSON.parse(fileReader.result as string);
                  /* if (testSfdtFile.sections[0].blocks) {
          if (testSfdtFile.sections[0].blocks.length > 0) {
            ++countValidate;
          } else {
            // toast opinion empty
            this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Opinion Empty! All data will be save except data at tab opinion' });
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
                    if (this.recomendation === 'Recommend With Condition') {
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
                          } else {
                            // toast condition empty
                            this.messageService.add({
                              severity: 'info',
                              summary: 'Warning',
                              detail: 'Condition Empty! All data will be save except data at tab opinion',
                            });
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
              this.saveUpdate('not-complete', source);
            }
          }
        }
      } else {
        /* this.creditProposalService.create(this.preSave()).subscribe(res => {
          this.creditProposal.collaterals = res.body.collaterals;
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
        }); */
      }
    }
  }

  private convertDate(date: any): any {
    if (typeof date === 'string') {
      let tempDate = '';
      const pointerDate = date.substring(11, 1);

      if (pointerDate === 'T') {
        tempDate = date.split('T')[0];
      }

      const newD = new Date(tempDate);
      const utcDate = new Date(Date.UTC(newD.getFullYear(), newD.getMonth(), newD.getDate(), newD.getHours(), newD.getMinutes()));
      return utcDate;
    } else {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
      return utcDate;
    }
  }

  public valueCpLendingProgram: [];
  public lendingProgramParameter() {
    this.lendingProgramParameterService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.lendingProgram = lodash.filter(res.body, function (o) {
          const fromDate = new Date(o.fromDate);
          const thruDate = new Date(o.thruDate);
          const convertFromDate = moment(fromDate).format('YYYY-MM-DD');
          const convertThruDate = moment(thruDate).format('YYYY-MM-DD');
          const newDate = moment(new Date()).format('YYYY-MM-DD');
          return o.statusId === 'ACTIVE' && convertFromDate <= newDate && convertThruDate >= newDate;
        });
        for (let i = 0; i < this.lendingProgram.length; i++) {
          if (this.lendingProgram[i].id === this.creditProposal.attributes['lendingProgramParameter']) {
            this.valueCpLendingProgram = this.lendingProgram[i].description;
          }
        }
      });
  }

  private preSave(status: string): ICreditProposal {
    for (let i = 0; i < this.creditProposalService.partySliks.length; i++) {
      this.creditProposal.sliks = [...this.creditProposal.sliks, this.creditProposalService.partySliks[i]];
    }
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);

    if (this.router.url.split('/')[1] === 'credit-proposal-status') {
      if (copyCreditProposal.attributes.businessActivity.visitDate) {
        if (typeof copyCreditProposal.attributes.businessActivity.visitDate === 'object') {
          copyCreditProposal.attributes.businessActivity.visitDate = this.convertDate(
            copyCreditProposal.attributes.businessActivity.visitDate
          );
        }
      }
    }

    let tempHelper = 0;
    const tempRouter = this.router.url.split('/')[1];

    if (tempRouter === 'cp-status-approval') {
      if (status === 'complete') {
        if (this.id && this.positionLogin && this.recomendation && this.uuidPath) {
          if (copyCreditProposal.notes.length > 0) {
            for (let i = 0; i < copyCreditProposal.notes.length; i++) {
              if (copyCreditProposal.notes[i].positionId === this.positionLogin) {
                copyCreditProposal.notes[i].applicationId = this.id;
                copyCreditProposal.notes[i].message = '';
                copyCreditProposal.notes[i].recomendation = this.recomendation;
                copyCreditProposal.notes[i].path = this.uuidPath;
                tempHelper = tempHelper + 1;
              }
            }

            if (tempHelper === 0) {
              copyCreditProposal.notes.push(this.addNewNotes(this.positionLogin, '', this.recomendation, this.uuidPath));
            }
          } else {
            copyCreditProposal.notes.push(this.addNewNotes(this.positionLogin, '', this.recomendation, this.uuidPath));
          }

          if (copyCreditProposal.attributes['positionLogin']) {
            delete copyCreditProposal.attributes['positionLogin'];
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
    copyCreditProposal.attributes['approvalStatus'] = JSON.stringify(copyCreditProposal.attributes['approvalStatus']);
    copyCreditProposal.attributes['dataAssignTo'] = JSON.stringify(copyCreditProposal.attributes['dataAssignTo']);
    copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
    copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
    copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    copyCreditProposal.attributes['coverageTotal'] = JSON.stringify(copyCreditProposal.attributes['coverageTotal']);
    copyCreditProposal.attributes['lendingProgramParameter'] = JSON.stringify(copyCreditProposal.attributes['lendingProgramParameter']);
    copyCreditProposal.attributes['collateralGroup'] = JSON.stringify(copyCreditProposal.attributes['collateralGroup']);
    copyCreditProposal.attributes['collateralSummary'] = JSON.stringify(copyCreditProposal.attributes['collateralSummary']);
    if (copyCreditProposal.prospectPerson) {
      copyCreditProposal.prospectPerson.dob = this.creditProposalStartState.prospectPerson.dob;
    }

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

  getText(value: any): string {
    if (value === 'cp-status-approval') {
      return 'Credit Proposal Approval';
    } else {
      return 'Credit Proposal';
    }
  }

  public getTextMenu(param: string): string {
    const titleMenu = param;
    const regex = /[-]/g;
    if (titleMenu === 'convenant-tbo') {
      const convenantTbo = titleMenu.replace(regex, ' & ');
      return convenantTbo;
    } else if (titleMenu === 'credit-proposal-approval') {
      return 'Credit Proposal Summary';
    } else {
      return titleMenu.replace(regex, ' ');
    }
  }

  showTextMenu() {
    return this.getTextMenu(this.clickedMenu);
  }
  disabledProptype() {
    if (this.parentPath === 'cp-status-approval') {
      return true;
    }
    return false;
  }

  getTitleUrl() {
    const x = this.router.url.split('/')[3].slice(0, 4).split('?');

    this.titleUrl = x;
  }
  public notes: any;

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
    }
  }

  public cekCgpgData() {
    for (let i = 0; i < this.collateralProperties.length; i++) {
      if (this.collateralProperties[i].propertyType === 'GENERAL') {
        this.saveCollateralProperty(this.collateralProperties[i]);
      }
    }
  }

  public saveCollateralProperty(property: ICollateralProperty) {
    this.collateralPropertyService.save(property).subscribe(res => {});
  }

  public setTotalPlafond() {
    if (this.creditProposal.products.length > 0) {
      if (!this.creditProposal.attributes['syncronHobisData']) {
        for (let i = 0; i < this.creditProposal.products.length; i++) {
          if (this.creditProposal.products[i].hobis === true) {
            if (this.creditProposal.products[i].productName !== '') {
              this.getLoanType(this.creditProposal.products[i].productTypeId, i);
            }
          }
        }
        this.creditProposal.attributes['syncronHobisData'] = 'syncroned';
      }
    }
  }

  public getLoanType(event, index) {
    this.productParameterService
      .queryFilterBy({
        idProductType: event,
        isActive: true,
        size: 9999,
      })
      .subscribe(res => {
        if (res.body) {
          const data = res.body.find(obj => obj.name === this.creditProposal.products[index].productName);
          if (data) {
            if (data.revolving === true) {
              this.creditProposal.products[index].totalPlafond =
                Number(this.creditProposal.products[index].initialLimit) + Number(this.creditProposal.products[index].changes);
            } else if (data.revolving === false) {
              this.creditProposal.products[index].totalPlafond =
                Number(this.creditProposal.products[index].outstanding) + Number(this.creditProposal.products[index].changes);
            }
          }
        }
      });
  }
  // CP/Float
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.previousState();
      }
    });
  }
  public triggerToggle() {
    this.isOpen = !this.isOpen;
  }
}
