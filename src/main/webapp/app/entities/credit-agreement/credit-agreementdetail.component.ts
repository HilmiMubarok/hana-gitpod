import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';

import {
  PROPOSAL_TYPE,
  SEGMENTS_TYPE,
  BASIC_SUBMENU_CREDITAGREEMENT,
  BASIC_SUBMENU_CREDITEGREEMENTREVIEW_MEMO,
} from 'app/shared/constants/base.constants';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import _ from 'lodash';
import { IApplicationRole } from '../application-role/application-role.model';
import { ApplicationRoleService } from '../application-role/application-role.service';
import { LendingProgramParameterService } from '../lending-program-parameter/lending-program-parameter.service';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import { StorageService } from '../storage/storage.service';
import { Observable, Subject, firstValueFrom, fromEvent, map, takeUntil } from 'rxjs';
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

import { PartyCifService } from '../party-cif/party-cif.service';
import { MasterPermissionService } from 'app/entities/master-parameter/master-permission/master-permission.service';

import { IApplicationProduct } from '../application-product/application-product.model';
import { CPFacilityTable, ICPFacilityTable } from '../credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { RemarskComponent } from '../credit-proposal/trade-checking/Remarks/credit-proposal-trade-checking-remarks.component';
import { CreditProposalTabBusinessActivityComponent } from '../credit-proposal/busines-activity/credit-proposal-tab-business-activity.component';
import { CPMemoBandingRemarkComponent } from '../credit-proposal/memo-banding/remarks/cp-memo-banding-remark.component';
import { CreditProposalCollateralInfoComponent } from '../credit-proposal/collateral-info/credit-proposal-collateral-info.component';
import { CollateralInfoHistoryComponent } from '../credit-proposal/collateral-info-history/collateral-info-history.component';
import { CreditProposalOpinionHistoryComponent } from '../credit-proposal/opinion-history/credit-proposal-opinion-history.component';
import { CreditProposalTabSummaryComponent } from '../credit-proposal/credit-proposal-tab-summary.component';
import { ProposalBasicInformationViewComponent } from '../credit-proposal/basic-information/basic-information-view.component';
import { CreditProposaTabManagementInfoComponent } from '../credit-proposal/credit-proposal-tab-management-info.component';
import { CreditAgreementProcessService } from './credit-agreement-process.service';
import { CreditAgreementService } from './credit-agreement.service';
import { ICreditAgreement } from './credit-agreement.model';
import { HttpClient } from '@angular/common/http';
import { formatBytes } from 'app/shared/helper/utils';
import { ICertificateInfo } from '../offering-letter/certificate-info/certificate-info.model';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CashCreditProposalsService } from '../cash-credit-proposal/cash-credit-proposals.service';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { BusinessActivityService } from '../credit-proposal/busines-activity/business-activity.service';
import { ViewportScroller } from '@angular/common';
import { GenerateReportService } from '../generate-report-service/generate-report.service';
import { CashCollateralService } from '../cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-credit-agreement-floating',
  templateUrl: './credit-agreementfloating.component.html',
  styleUrls: ['./credit-agreement.css'],
})
export class CreditAgreementDetailComponent implements OnInit {
  @ViewChild('creditProposalTabBusinessActivityComponent', {
    static: false,
  })
  creditProposalTabBusinessActivityComponent: CreditProposalTabBusinessActivityComponent;

  @ViewChild('CPMemoBandingRemarkComponent', {
    static: false,
  })
  CPMemoBandingRemarkComponent: CPMemoBandingRemarkComponent;

  @ViewChild('creditProposalCollateralInfoComponent', {
    static: false,
  })
  creditProposalCollateralInfoComponent: CreditProposalCollateralInfoComponent;

  @ViewChild('creditProposalCollateralInfoHistoryComponent', {
    static: false,
  })
  creditProposalCollateralInfoHistoryComponent: CollateralInfoHistoryComponent;

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

  public currencyMaster: number;
  public myBusinessGroupCPFacility: ICPFacilityTable[] = [];
  public groupProduct: IApplicationProduct[] = [];
  public listGroupCollateral = [];
  public collateralPropertyGroupData: ICollateralProperty[] = [];
  public listLoanType: any;
  private collateralProperties: ICollateralProperty[] = [];
  private collateral: ICollateral[] = [];
  private id: number;
  public clickedMenu: string;
  public tasks: IProcessTask[] = new Array<IProcessTask>();

  public creditProposal: ICreditProposal;
  public creditProposalStartState: ICreditAgreement;

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
  public ca: ICreditAgreement;
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
  public headerTitle = 'select proposal type';

  private saveState: string;
  public parentSubject: Subject<any> = new Subject();

  public permission: any;
  private position: any;
  public postalAdresss;
  public dataLand: any;
  public dataBuilding: any;
  private KEYG = 'generate-final';
  private KEYDRAFTGENERATE = 'aggrement';
  private ngUnsubscribe = new Subject();
  public dataPKFinal = [];
  public dataPkDraft: object[];

  constructor(
    private partyCifService: PartyCifService,
    public cashCreditProposalsService: CashCreditProposalsService,
    private creditAgreementService: CreditAgreementService,
    private creditAgreementProcessService: CreditAgreementProcessService,
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
    public industryLimitExposureParameterService: IndustryLimitExposureParameterService,
    protected masterPermissionService: MasterPermissionService,
    private http: HttpClient,
    private baService: BusinessActivityService,
    private viewport: ViewportScroller,
    private generatePkDraftService: GenerateReportService,
    private cashCollateralService: CashCollateralService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.creditProposalStartState = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.subMenu = this.creditProposal.attributes['previousOfferingLetter']
      ? // ? [...BASIC_SUBMENU_CREDITAGREEMENT, { id: 'memo-banding', text: 'Memo Banding' }]
        BASIC_SUBMENU_CREDITEGREEMENTREVIEW_MEMO
      : BASIC_SUBMENU_CREDITAGREEMENT;
    this.proposalType = PROPOSAL_TYPE;
    this.segmentType = SEGMENTS_TYPE;

    this.activeRoute = this.router.url.replace(/\//g, '');
    this.clickedMenu = 'dar-summary';
    this.url = this.parentPath;

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.clickedMenu = subRoute;
        this.showTextMenu();
      }
    });
    // this.isHistoryExist = this.creditProposal.attributes.previousHistory && this.parentPath !== 'finalize-pk' ? true : false;
    this.isHistoryExist = this.creditProposal.attributes.previousHistory ? true : false;
    this.setTotalPlafond();

    this.baService.isLoading$.subscribe(res => {
      this.baLoading = res;
    });
    this.baService.progress$.subscribe(res => {
      this.progress = res;
    });

    this.generatePkDraftService.dataReportDraft$.subscribe(res => {
      this.dataPkDraft = res;
    });
  }

  public progress: number;
  public baLoading: Boolean = false;

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
      this.position = newPos;
      this.positionTypeId = newPos.positionTypeId;
      this.conditionSaveBtn();
    });
  }
  public conditionSaveBtn() {
    if (this.router.url.includes('finalize-pk')) {
      this.conditionSave = true;
    }
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
      this.creditAgreementService.update(this.preSave(statusPreSave)).subscribe(res => {
        this.creditProposal.notes = res.body.notes;

        if (this.creditProposalTabBusinessActivityComponent) {
          this.creditProposalTabBusinessActivityComponent.triggeredSaveAll();
        }

        if (this.CPMemoBandingRemarkComponent) {
          this.CPMemoBandingRemarkComponent.triggeredSave();
        }

        /* if (this.creditProposalOpinionHistoryComponent) {
          this.creditProposalOpinionHistoryComponent.triggeredSave();
          this.creditProposalOpinionHistoryComponent.triggeredSaveCondition();
          this.creditProposalOpinionHistoryComponent.refresh();
    } */

        if (this.CreditProposalTabSummaryComponent) {
          this.CreditProposalTabSummaryComponent.triggeredSave();
        }

        if (this.parentPath !== 'finalize-pk') {
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
          if (this.parentPath === 'finalize-pk') {
            this.saveApplicationRole();
          } else {
            this.creditAgreementProcessService.processTask(this.resAttr).subscribe(() => {
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
    this.getBucketNameSummaryPKDraf();

    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });

    this.creditAgreementService.find(this.activatedRoute.snapshot.data['content'].id).subscribe((response: any) => {
      const menuItemIdByRoute = this.router.url.includes('finalize-pk') ? 'FINALIZE_CREDIT_AGREEMENT' : 'FINALIZE_CREDIT_AGREEMENT';
      this.ca = response.body;
      this.masterPermissionService
        .queryFilterBy({ menuItemId: menuItemIdByRoute, positionTypeId: this.position.positionTypeId, statusId: this.ca.statusId })
        .subscribe(permissionObject => {
          this.permission = permissionObject.body;
        });
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
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });
    this.getTitleUrl();
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }

    this.loadDataBy();
    this.showTextMenu();
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
    if (this.listGroupCollateral.length > 0) {
      for (let j = 0; j < this.listGroupCollateral.length; j++) {
        if (this.listGroupCollateral[j].customerType === 'PERSONAL') {
          this.findCollateralPropertyGroup(this.listGroupCollateral[j].partyId);
        } else {
          this.findCollateralPropertyGroup(this.listGroupCollateral[j].partyId);
        }
      }
    }
    // this.cpGroub();
  }

  public goToSubMenu(menu: string): void {
    this.clickedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    const routeHelper =
      this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3].substr(0, 4);
    this.router.navigate([routeHelper], { queryParams: { subroute: menu['id'] } });
  }

  public previousState(): void {
    window.history.back();
  }

  private getTasks(): void {
    // this.creditAgreementProcessService.getTasks(this.id).subscribe(res => {
    this.creditAgreementProcessService
      .getTasksByPos(this.id, { idPosition: this.getLocStor('POS'), idMenu: this.parentPath })
      .subscribe(res => {
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
        this.resAttr.attr['idApplication'] = this.creditProposal.id;

        if (this.validateDraft()) {
          // Validasi Final
          if (this.validateFinal()) {
            this.save('process');
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Please Generate PK Final first.',
            });
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please Generate PK Draft first.',
          });
        }
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
    this.creditAgreementProcessService.processTask(this.resAttr).subscribe(() => {
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

  public deleteColumnApprovalDeptorsConditions() {
    this.cashCreditProposalsService.deletePropsResource(this.creditProposal.entityProperties[1].id).subscribe(() => {});
  }

  public onClickRed(): void {
    this.parentSubject.next('red-clicked');
  }

  private saveFile(): void {
    const formDataOpinionSfdt = new FormData();
    const formDataOpinionWord = new FormData();

    const formDataConditionSfdt = new FormData();
    const formDataConditionWord = new FormData();

    /* const fileNameSfdt = this.uuidPath + '.sfdt';
    const fileNameWord = this.uuidPath + '.docs'; */
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
  }

  private saveUpdate(status: string, source: string): void {
    this.cashCreditProposalsService.update(this.preSave(status)).subscribe(res => {
      this.creditProposal.products = res.body.products;
      this.creditProposal.collaterals = res.body.collaterals;

      if (status === 'complete') {
        this.saveFile();
      }

      if (this.creditProposalTabBusinessActivityComponent) {
        this.creditProposalTabBusinessActivityComponent.triggeredSaveAll();
      }

      if (this.CPMemoBandingRemarkComponent) {
        this.CPMemoBandingRemarkComponent.triggeredSave();
      }

      /* if (this.creditProposalOpinionHistoryComponent) {
    this.creditProposalOpinionHistoryComponent.triggeredSave();
    this.creditProposalOpinionHistoryComponent.triggeredSaveCondition();
    this.creditProposalOpinionHistoryComponent.refresh();
    } */

      if (this.CreditProposalTabSummaryComponent) {
        this.CreditProposalTabSummaryComponent.triggeredSave();
      }

      if (this.parentPath !== 'finalize-pk') {
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

      if (this.creditProposalCollateralInfoHistoryComponent) {
        this.creditProposalCollateralInfoHistoryComponent.triggeredSave(this.creditProposal.attributes.proposalType);
      }

      if (this.remaksComponent) {
        this.remaksComponent.triggeredSave();
      }

      if (source === 'process') {
        if (this.parentPath === 'finalize-pk') {
          this.saveApplicationRole();
        } else {
          this.saveWord = false;
          this.creditAgreementProcessService.processTask(this.resAttr).subscribe(() => {
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

  clearApprovalDebtorConditions() {
    const entityProperties = this.creditProposal.entityProperties;

    // filter where entityProperties.entityPropertyTypeId === "APPROVAL_DEBTOR_CONDITIONS"
    entityProperties.forEach((entityProperty, index) => {
      if (entityProperty.entityPropertyTypeId === 'APPROVAL_DEBTOR_CONDITIONS') {
        // Find where approvalDebtorConditionStatus === null
        if (entityProperty.approvalDebtorConditionStatus === null || entityProperty.approvalDebtorConditionStatus === '') {
          // Delete
          this.cashCreditProposalsService.deletePropsResource(entityProperty.id).subscribe(() => {
            entityProperties.splice(index, 1);
          });
        }
      }
    });
  }

  public save(source: string): void {
    // Clear Approval Debtor Conditions
    this.clearApprovalDebtorConditions();

    this.saveCollateralAfterReport();
    this.setIndustryName();
    this.saveState = source;

    // if (this.creditProposal.attributes.proposalType === null || this.creditProposal.attributes.proposalType === '') {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Please Select Proposal Type',
    //   });
    // } else {
    this.saveWord = true;

    if (this.creditProposal.id) {
      // if (this.router.url.split('/')[1] === 'finalize-pk') {
      //   this.saveUpdate('not-complete', source);
      // }
      if (this.router.url.split('/')[1] === 'finalize-pk') {
        if (this.creditProposalOpinionHistoryComponent) {
          this.creditProposalOpinionHistoryComponent.triggeredSaveValidate();
        } else {
          let countValidate = 0;
          if (this.positionLogin) {
            if (this.opinionFileSfdt && this.opinionFileWord) {
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const testSfdtFile = JSON.parse(fileReader.result as string);
                if (
                  testSfdtFile.sections[0].blocks[0].inlines ||
                  testSfdtFile.sections[0].blocks[0].columnCount ||
                  testSfdtFile.sections[0].blocks[0].paragraphFormat ||
                  testSfdtFile.sections[0].blocks[0].grid ||
                  testSfdtFile.sections[0].blocks[0].rows ||
                  testSfdtFile.sections[0].blocks[0].tableFormat
                ) {
                  if (
                    testSfdtFile.sections[0].blocks[0].paragraphFormat ||
                    testSfdtFile.sections[0].blocks[0].grid ||
                    testSfdtFile.sections[0].blocks[0].rows ||
                    testSfdtFile.sections[0].blocks[0].tableFormat
                  ) {
                    ++countValidate;
                  } else if (testSfdtFile.sections[0].blocks[0].columnCount) {
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
                          testSfdtFileCondition.sections[0].blocks[0].columnCount ||
                          testSfdtFileCondition.sections[0].blocks[0].paragraphFormat ||
                          testSfdtFileCondition.sections[0].blocks[0].grid ||
                          testSfdtFileCondition.sections[0].blocks[0].rows ||
                          testSfdtFileCondition.sections[0].blocks[0].tableFormat
                        ) {
                          if (
                            testSfdtFileCondition.sections[0].blocks[0].paragraphFormat ||
                            testSfdtFileCondition.sections[0].blocks[0].grid ||
                            testSfdtFileCondition.sections[0].blocks[0].rows ||
                            testSfdtFileCondition.sections[0].blocks[0].tableFormat
                          ) {
                            ++countValidate;
                          } else if (testSfdtFileCondition.sections[0].blocks[0].columnCount) {
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
      // } else {
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

  // public save(source: string): void {
  //   if (this.creditProposal.id) {
  //     this.creditAgreementService.update(this.preSave('process')).subscribe(res => {
  //       this.saveCollateralAfterReport();
  //       // this.saveApplicationRole(source);
  //     });
  //   } else {
  //     this.creditAgreementService.create(this.preSave('process')).subscribe(res => {
  //       this.saveCollateralAfterReport();
  //       // this.saveApplicationRole(source);
  //     });
  //   }
  // }

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

  private preSave(status: string): ICreditAgreement {
    for (let i = 0; i < this.creditAgreementService.partySliks.length; i++) {
      this.creditProposal.sliks = [...this.creditProposal.sliks, this.creditAgreementService.partySliks[i]];
    }
    const copyCreditProposal: ICreditAgreement = lodash.cloneDeep(this.creditProposal);

    if (this.router.url.split('/')[1] === 'finalize-pk') {
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

    if (tempRouter === 'finalize-pk') {
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
    if (copyCreditProposal.attributes) {
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
      copyCreditProposal.debtorData.attributes['prospectPerson'] = JSON.stringify(
        copyCreditProposal.debtorData.attributes['prospectPerson']
      );
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
      copyCreditProposal.attributes['facilityTakeOverAfterBank'] = JSON.stringify(
        copyCreditProposal.attributes['facilityTakeOverAfterBank']
      );
      copyCreditProposal.attributes['complienceReccomendation'] = JSON.stringify(copyCreditProposal.attributes['complienceReccomendation']);
      copyCreditProposal.attributes['industryLimit'] = JSON.stringify(copyCreditProposal.attributes['industryLimit']);
      copyCreditProposal.attributes['offeringLetter'] = JSON.stringify(copyCreditProposal.attributes['offeringLetter']);
      copyCreditProposal.attributes['bankAnalystMessage'] = JSON.stringify(copyCreditProposal.attributes['bankAnalystMessage']);
      copyCreditProposal.attributes['previous'] = JSON.stringify(copyCreditProposal.attributes['previous']);
      copyCreditProposal.attributes['offeringLetterPreparation'] = JSON.stringify(
        copyCreditProposal.attributes['offeringLetterPreparation']
      );
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
      copyCreditProposal.attributes['collateralAfterData'] = JSON.stringify(copyCreditProposal.attributes['collateralAfterData']);
      copyCreditProposal.attributes['collateralAfterReport'] = JSON.stringify(copyCreditProposal.attributes['collateralAfterReport']);
      copyCreditProposal.attributes['collateralSummary'] = JSON.stringify(copyCreditProposal.attributes['collateralSummary']);
      copyCreditProposal.attributes['groupChecklisCollateral'] = JSON.stringify(copyCreditProposal.attributes['groupChecklisCollateral']);

      if (copyCreditProposal.attributes['previousHistory']) {
        copyCreditProposal.attributes['previousHistory'] =
          typeof copyCreditProposal.attributes['previousHistory'] !== 'string'
            ? JSON.stringify(copyCreditProposal.attributes['previousHistory'])
            : copyCreditProposal.attributes['previousHistory'];
      }

      if (copyCreditProposal.prospectPerson) {
        copyCreditProposal.prospectPerson.dob = this.creditProposalStartState.prospectPerson.dob;
      }

      if (typeof copyCreditProposal.attributes['certificateInfoData'] !== 'string') {
        copyCreditProposal.attributes['certificateInfoData'] = JSON.stringify(copyCreditProposal.attributes['certificateInfoData']);
      }

      return copyCreditProposal;
    } else {
      return copyCreditProposal;
    }
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
    if (value === 'finalize-pk') {
      return 'Credit Agrement';
    } else {
      return 'Credit Agreement';
    }
  }

  public showTextMenu(): void {
    if (this.subMenu.length > 1) {
      const menuList = [];
      menuList.push(this.subMenu);
      for (let i = 0; i < menuList.length; i++) {
        for (let x = 0; x < menuList[i].length; x++) {
          if (this.clickedMenu === menuList[i][x].id) {
            this.headerTitle = menuList[i][x].text;
          } else {
            for (let y = 0; y < menuList[i][x].child?.length; y++) {
              if (this.clickedMenu === menuList[i][x].child[y].id) {
                this.headerTitle = menuList[i][x].child[y].text;
              }
            }
          }
        }
      }
    }
  }

  // disabledProptype() {
  //   if (this.parentPath === 'cp-status-approval') {
  //     return true;
  //   }
  //   return false;
  // }

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
        size: 999,
      })
      .subscribe(res => {
        this.collateral = res.body;
      });
  }

  public findCollateralProperty(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];
      this.setCertificate(this.collateral);
    });
  }

  public setCertificate(collateral) {
    if (!this.creditProposal.attributes['syncCertificate']) {
      this.creditProposal.attributes['syncCertificate'] = 'true';
      this.creditProposal.attributes['certificateInfoData'] = [];
      if (collateral.length > 0) {
        for (let i = 0; i < collateral.length; i++) {
          if (collateral[i].collateralTypeId === 'REALESTATE') {
            if (collateral[i].attributes['landCertificates']) {
              collateral[i].attributes['landCertificates'] = JSON.parse(collateral[i].attributes['landCertificates']);
              if (collateral[i].attributes['landCertificates'].length > 0) {
                for (let j = 0; j < collateral[i].attributes['landCertificates'].length; j++) {
                  const certificate: ICertificateInfo = {};
                  certificate.id = collateral[i].id;
                  certificate.buktiKepemilikan = collateral[i].collateralTypeDescription + ' ' + collateral[i].collateralNumber;
                  certificate.jangkaWaktuKepemilikan = collateral[i].attributes['landCertificates'][j].certDueDate;
                  certificate.luasTanah = this.findPropertyLand('luasTanah', collateral[i], j);
                  certificate.luasBangunan = this.findPropertyLand('luasBangunan', collateral[i], j);
                  this.creditProposal.attributes['certificateInfoData'].push(certificate);
                }
              }
            }
          }
          if (collateral[i].collateralTypeId === 'VEHICLE') {
            const dataVehicle: ICollateralProperty[] = this.collateralProperties.filter(
              obj => obj.collateralId === collateral[i].id && obj.propertyType === 'VEHICLE'
            );
            if (dataVehicle.length > 0) {
              for (let j = 0; j < dataVehicle.length; j++) {
                const certificate: ICertificateInfo = {};
                certificate.id = collateral[i].id;
                certificate.buktiKepemilikan = dataVehicle[j].bpkbNum;
                this.creditProposal.attributes['certificateInfoData'].push(certificate);
              }
            }
          }
          if (collateral[i].collateralTypeId === 'MACHINE') {
            const dataMachine: ICollateralProperty[] = this.collateralProperties.filter(
              obj => obj.collateralId === collateral[i].id && obj.propertyType === CollateralPropertyType.MACHINE
            );
            if (dataMachine.length > 0) {
              for (let j = 0; j < dataMachine.length; j++) {
                const certificate: ICertificateInfo = {};
                certificate.id = collateral[i].id;
                certificate.buktiKepemilikan = dataMachine[j].machineDocType + ' ' + dataMachine[j].machineDocNum;
                this.creditProposal.attributes['certificateInfoData'].push(certificate);
              }
            }
          }
          if (collateral[i].collateralTypeId === 'DEPOSIT') {
            const certificate: ICertificateInfo = {};
            certificate.id = collateral[i].id;
            certificate.buktiKepemilikan = collateral[i].collateralTypeDescription + ' ' + collateral[i].collateralNumber;
            certificate.jangkaWaktuKepemilikan = this.findProperty('jangkaWaktu', collateral[i]);
            this.creditProposal.attributes['certificateInfoData'].push(certificate);
          }
          if (collateral[i].collateralTypeId === 'CORPORATEPERSONALGUARANTEE') {
            const certificate: ICertificateInfo = {};
            certificate.id = collateral[i].id;
            certificate.buktiKepemilikan = collateral[i].collateralNumber + ' ' + this.findProperty('buktiKepemilikan', collateral[i]);
            certificate.jangkaWaktuKepemilikan = this.findProperty('jangkaWaktu', collateral[i]);
            this.creditProposal.attributes['certificateInfoData'].push(certificate);
          }
          if (collateral[i].collateralTypeId === 'SECURITIES') {
            const certificate: ICertificateInfo = {};
            certificate.id = collateral[i].id;
            certificate.buktiKepemilikan = this.findProperty('buktiKepemilikan', collateral[i]);
            certificate.jangkaWaktuKepemilikan = this.findProperty('jangkaWaktu', collateral[i]);
            this.creditProposal.attributes['certificateInfoData'].push(certificate);
          }
          if (collateral[i].collateralTypeId === 'LETTER_OF_GUARANTY') {
            const certificate: ICertificateInfo = {};
            certificate.id = collateral[i].id;
            certificate.buktiKepemilikan = collateral[i].collateralNumber;
            certificate.jangkaWaktuKepemilikan = this.findProperty('jangkaWaktu', collateral[i]);
            this.creditProposal.attributes['certificateInfoData'].push(certificate);
          }
        }
      }
      if (this.creditProposal.attributes['certificateInfoData']) {
        for (let i = 0; i < this.creditProposal.attributes['certificateInfoData'].length; i++) {
          this.creditProposal.attributes['certificateInfoData'][i].index = i;
        }
      }
    } else {
      this.creditProposal.attributes['certificateInfoData'] = JSON.parse(this.creditProposal.attributes['certificateInfoData']);
    }
  }
  public findPropertyLand(type: string, collateral: ICollateral, i: number) {
    this.dataLand = lodash.filter(this.collateralProperties, function (o) {
      return o.propertyType === 'LAND' && o.collateralId === collateral.id && o.external === false;
    });
    this.dataBuilding = lodash.filter(this.collateralProperties, function (o) {
      return o.propertyType === 'BUILDING' && o.collateralId === collateral.id && o.external === false;
    });
    if (this.dataLand) {
      if (type === 'luasTanah') {
        return this.dataLand[i].landSizePerCertificate;
      }
    }
    if (this.dataBuilding) {
      if (type === 'luasBangunan') {
        return this.countTotalArea(this.dataBuilding[i].attributes['floors']);
      }
    }
    return '';
  }

  public findProperty(type: string, collateral: ICollateral) {
    let data: ICollateralProperty;
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data) {
        if (type === 'buktiKepemilikan') {
          if (collateral.collateralTypeId === 'SECURITIES') {
            return data.attributes.securityName;
          }
          if (collateral.collateralTypeId === 'CORPORATEPERSONALGUARANTEE') {
            return data.attributes.certificateType;
          }
        }
        if (type === 'jangkaWaktu') {
          if (collateral.collateralTypeId === 'DEPOSIT') {
            return data.attributes.maturityDate;
          }
          if (collateral.collateralTypeId === 'SECURITIES') {
            return data.attributes.maturityDate;
          }
          if (collateral.collateralTypeId === 'OTHER') {
            return data.attributes.maturityDate;
          }
          if (collateral.collateralTypeId === 'LETTER_OF_GUARANTY') {
            return data.attributes.requisitionExpiry;
          }
          if (collateral.collateralTypeId === 'PERSONAL_PROPERTY') {
            return data.attributes.maturityDate;
          }
          if (collateral.collateralTypeId === 'CORPORATEPERSONALGUARANTEE') {
            return data.certificateExpiryDate;
          }
        }
      }
      return '';
    }
  }
  public countTotalArea(data: string): Number {
    let total: number;
    total = 0;

    if (data) {
      const _data = JSON.parse(data);
      if (_data.length > 0) {
        for (let i = 0; i < _data.length; i++) {
          total = total + parseInt(_data[i]['area'], 10);
        }
      }
    }

    return total;
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
  public findCollateralPropertyGroup(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralPropertyGroupData = [...this.collateralProperties, ...res.body];
    });
  }
  public loadDataBy(): void {
    const cifNumber = this.creditProposal.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
    });
  }

  public saveCollateralAfterReport() {
    if (this.creditProposal.attributes['collateralAfterReport']) {
      while (typeof this.creditProposal.attributes['collateralAfterReport'] === 'string') {
        this.creditProposal.attributes['collateralAfterReport'] = JSON.parse(this.creditProposal.attributes['collateralAfterReport']);
      }
      if (this.creditProposal.attributes['collateralAfterReport'].length > 0) {
        for (let i = 0; i < this.creditProposal.attributes['collateralAfterReport'].length; i++) {
          this.creditProposal.attributes['collateralAfterReport'][i].mvInternal = this.countMV(
            this.creditProposal.attributes['collateralAfterReport'][i].id
          );
          this.creditProposal.attributes['collateralAfterReport'][i].lvInternal = this.countLV(
            this.creditProposal.attributes['collateralAfterReport'][i].id
          );
        }
      }
    } else {
      this.creditProposal.attributes['collateralAfterReport'] = [];
    }
  }

  public countMV(id: number): number {
    const data: ICollateralProperty = this.collateralProperties.find(
      obj => obj.propertyType === 'GENERAL' && obj.collateralId === id && obj.external === false
    );
    if (data !== undefined) {
      if (data.marketValue === null) {
        return 0;
      } else {
        return data.marketValue;
      }
    }
    return 0;
  }

  public countLV(id: number): number {
    const data: ICollateralProperty = this.collateralProperties.find(
      obj => obj.propertyType === 'GENERAL' && obj.collateralId === id && obj.external === false
    );
    if (data !== undefined) {
      if (data.liquidationValue === null) {
        return 0;
      } else {
        return data.liquidationValue;
      }
    }
    return 0;
  }

  // public cpGroub() {
  //   const setDate = new Date().toISOString().split('T')[0];
  //   this.creditAgreementService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
  //     this.currencyMaster = res.body[0]?.factor;
  //   });
  //   this.creditAgreementService.applicationGroubProduct(this.id).subscribe((response: any) => {
  //     this.filterBusinessGroupDebtorData(response.body);
  //     this.creditProposal.attributes['calculationExposure'].totalPsrGroup = this.countTotalPsrGroup();
  //   });
  // }

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

  // Untuk Summary Generate

  // Untuk Summary Generate
  private getBucketNameSummary() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];

      if (this.id) {
        this.KEYG += `/${this.id}/document/`;
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

        this.dataPKFinal = data;
      });
  }

  // Change the access modifier to public
  public generatePKFinal(): void {
    this.generateFilePkFinal().then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File Generated Successfully',
      });
      this.onRefresh();
    });
  }

  public showButtonGeneratePK() {
    const parentPath = this.router.url.split('/')[1];
    if (parentPath.match(/finalize-pk/g) && this.creditProposal.statusId === 'PK_GENERATED') {
      return true;
    } else {
      return false;
    }
  }

  private async generateFilePkFinal(): Promise<void> {
    const fileDpdlFinal = await firstValueFrom(
      this.http.get(`/services/report/api/report/agreement/pdf-word/${this.creditProposal.agreements[0].id}?type=final`, {
        responseType: 'text',
        observe: 'response',
      })
    );
  }

  // scroll-up

  readonly showScroll$: Observable<boolean> = fromEvent(window, 'scroll').pipe(map(() => this.viewport.getScrollPosition()?.[1] > 0));

  onScrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
  }

  // Cek data Generate Draft PK
  private getBucketNameSummaryPKDraf() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];

      if (this.creditProposal.agreements[0].id) {
        this.KEYDRAFTGENERATE += `/${this.creditProposal.agreements[0].id}/document/draft/final/`;
      } else {
        console.warn('Param id not found');
      }

      this.onRefreshDrafPk();
    });
  }
  private onRefreshDrafPk(): void {
    const obj = {
      key: this.KEYDRAFTGENERATE,
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
        this.dataPkDraft = data;
        this.generatePkDraftService.setDataReportDraft(this.dataPkDraft);
      });
  }
  private validateDraft(): boolean {
    if (this.dataPkDraft && this.dataPkDraft.length === 0) {
      return false;
    }
    return true;
  }

  private validateFinal(): boolean {
    const dataGeneratePKFinal = this.dataPKFinal.filter(e => e.tags.documentType === 'DOC_GENERATE_PK');
    if (this.parentPath.match(/finalize-pk/g) && this.creditProposal.statusId === 'PK_GENERATED') {
      if (dataGeneratePKFinal && dataGeneratePKFinal.length === 0) {
        return false;
      }
    }
    return true;
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
