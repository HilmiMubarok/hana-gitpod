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
  BASIC_SUBMENU_LOAN_OPS_DIST_MEMO,
  BASIC_SUBMENU_LOAN_OPS_DIST,
} from 'app/shared/constants/base.constants';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import _ from 'lodash';
import { IEJOptionNode } from 'app/shared/model/option-node.model';
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
import { ICPFacilityTable } from '../credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { HttpClient } from '@angular/common/http';
import { BusinessActivityService } from '../credit-proposal/busines-activity/business-activity.service';
import { ViewportScroller } from '@angular/common';
import { ILoanOPSChecking } from './loan-ops-checking.model';
import { LoanOpsCheckingService } from './loan-ops-checking.service';
import { LoanOpsCheckingProcessService } from './loan-ops-checking-process.service';
import { CreditProposalTabSummaryComponent } from '../credit-proposal/credit-proposal-tab-summary.component';
import { MenuPermissionService } from '../menu-permissions/menu-permissions.service';
@Component({
  selector: 'jhi-loan-ops-checking-detail',
  templateUrl: './loan-ops-checking-detail.component.html',
  styleUrls: ['./loan-ops-checking.css'],
})
export class LoanOpsCheckingDetailComponent implements OnInit {
  CreditProposalTabSummaryComponent: CreditProposalTabSummaryComponent;

  @ViewChild('proposalBasicInformationViewComponent', {
    static: false,
  })
  public currencyMaster: number;
  public myBusinessGroupCPFacility: ICPFacilityTable[] = [];
  public groupProduct: IApplicationProduct[] = [];
  public listGroupCollateral: any;
  public collateralPropertyGroupData: ICollateralProperty[] = [];
  public listLoanType: any;
  private collateralProperties: ICollateralProperty[] = [];
  private collateral: ICollateral[] = [];
  private id: number;
  public clickedMenu: string;
  public tasks: IProcessTask[] = new Array<IProcessTask>();

  public creditProposal: ILoanOPSChecking;
  public creditProposalStartState: ILoanOPSChecking;

  public proposalType: object[];

  public segmentType: object[];

  public currentAccount: Account;

  public subMenu: object[];
  public uuidPath: any;
  public recomendation: string;
  public positionLogin: number;

  public url: string;
  public activeRoute: string;
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
  public ca: ILoanOPSChecking;
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

  constructor(
    private partyCifService: PartyCifService,
    private loanOpsCheckingService: LoanOpsCheckingService,
    private loanOpsCheckingProcessService: LoanOpsCheckingProcessService,
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
    private menuPermissionService: MenuPermissionService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.creditProposalStartState = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.subMenu = this.creditProposal.attributes['previousOfferingLetter']
      ? // ? [...BASIC_SUBMENU_CREDITAGREEMENT, { id: 'memo-banding', text: 'Memo Banding' }]
        BASIC_SUBMENU_LOAN_OPS_DIST_MEMO
      : BASIC_SUBMENU_LOAN_OPS_DIST;
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
    // this.setTotalPlafond();

    this.baService.isLoading$.subscribe(res => {
      this.baLoading = res;
    });
    this.baService.progress$.subscribe(res => {
      this.progress = res;
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
    if (this.router.url.includes('loan-ops-distribution')) {
      if (this.positionTypeId === 'BM') {
        if (this.creditProposal.statusId === 'CP_APPROVAL_BM') {
          this.conditionSave = true;
        } else {
          this.conditionSave = false;
        }
      }
    }
  }
  setIsAllowSave(status: boolean) {
    const statusPreSave = status ? 'complete' : 'not-complete';

    if (this.creditProposal.id) {
      this.loanOpsCheckingService.update(this.preSave(statusPreSave)).subscribe(res => {
        this.creditProposal.notes = res.body.notes;

        if (this.CreditProposalTabSummaryComponent) {
          this.CreditProposalTabSummaryComponent.triggeredSave();
        }
        if (this.saveState === 'process') {
          if (this.parentPath === 'loan-ops-distribution') {
            this.saveApplicationRole();
          } else {
            this.loanOpsCheckingProcessService.processTask(this.resAttr).subscribe(() => {
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

    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });

    this.loanOpsCheckingService.find(this.activatedRoute.snapshot.data['content'].id).subscribe((response: any) => {
      const menuItemIdByRoute = this.router.url.includes('loan-ops-distribution')
        ? 'LOAN_OPERATION_DISTRIBUTION'
        : 'LOAN_OPERATION_DISTRIBUTION';

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

    this.loadDataBy();
    this.showTextMenu();
    this.getMenuPermission();
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
    this.loanOpsCheckingProcessService
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

  private saveApplicationRole(): void {
    this.saveWord = false;
    this.loanOpsCheckingProcessService.processTask(this.resAttr).subscribe(() => {
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
    this.loanOpsCheckingService.update(this.preSave(status)).subscribe(res => {
      this.creditProposal.products = res.body.products;
      this.creditProposal.collaterals = res.body.collaterals;

      if (status === 'complete') {
        this.saveFile();
        if (this.CreditProposalTabSummaryComponent) {
          this.CreditProposalTabSummaryComponent.triggeredSave();
        }
      }
      if (source === 'process') {
        if (this.parentPath === 'loan-ops-distribution') {
          this.saveApplicationRole();
        } else {
          this.saveWord = false;
          this.loanOpsCheckingProcessService.processTask(this.resAttr).subscribe(() => {
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
        if (this.router.url.split('/')[1] === 'loan-ops-distribution') {
          this.saveUpdate('not-complete', source);
        }
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

  private preSave(status: string): ILoanOPSChecking {
    for (let i = 0; i < this.loanOpsCheckingService.partySliks.length; i++) {
      this.creditProposal.sliks = [...this.creditProposal.sliks, this.loanOpsCheckingService.partySliks[i]];
    }
    const copyCreditProposal: ILoanOPSChecking = lodash.cloneDeep(this.creditProposal);

    if (this.router.url.split('/')[1] === 'loan-ops-checking') {
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

    if (tempRouter === 'loan-ops-checking') {
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
    copyCreditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(copyCreditProposal.attributes['proformaLaporanKeuangan']);

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
    if (value === 'loan-ops-checking') {
      return 'Loan Operation Checking';
    } else {
      return 'Loan Operation Checking';
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

  public loadDataBy(): void {
    const cifNumber = this.creditProposal.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
      this.getAllColGroup();
    });
  }

  private getAllColGroup() {
    return new Promise((resolve, reject) => {
      if (this.listGroupCollateral.length > 0) {
        for (let j = 0; j < this.listGroupCollateral.length; j++) {
          this.collateralService
            .queryFilterBy({
              idParty: this.listGroupCollateral[j].partyId,
              isActive: true,
            })
            .subscribe(res => {
              if (res.body) {
                for (let i = 0; i < res.body.length; i++) {
                  if (res.body[i].id) {
                    this.collateralPropertyService.queryFilterBy({ idCollateral: res.body[i].id, page: 0, size: 9999 }).subscribe(res2 => {
                      this.collateralPropertyGroupData = [...this.collateralPropertyGroupData, ...res2.body];
                    });
                  }
                }
              }
              resolve(this.collateralPropertyGroupData);
            });
        }
      }
    });
  }

  readonly showScroll$: Observable<boolean> = fromEvent(window, 'scroll').pipe(map(() => this.viewport.getScrollPosition()?.[1] > 0));

  onScrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
  }

  public isValuePermissionChecking = [];
  public isLabel = false;
  public isElement = false;

  private getMenuPermission() {
    this.menuPermissionService
      .getAppMenuPermission('LOAN_OPERATION_CHECKING', this.getLocStor('POSO'), this.creditProposal.statusId)
      .subscribe(res => {
        this.isValuePermissionChecking = res.body;
        if (this.isValuePermissionChecking.length === 0) {
          this.isLabel = true;
          this.isElement = false;
        } else {
          this.isElement = true;
          this.isLabel = false;
        }
      });
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
