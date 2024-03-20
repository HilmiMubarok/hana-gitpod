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
import { POSITION_TYPE, SUBMENU_OFFERING_LETTER, SUBMENU_OFFERING_LETTER_FINALIZE } from 'app/shared/constants/base.constants';
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
import { CreditProposalCollateralInfoComponent } from '../credit-proposal/collateral-info/credit-proposal-collateral-info.component';
import { Observable, Subject, firstValueFrom, fromEvent, map, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { formatBytes } from 'app/shared/helper/utils';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import { LendingProgramParameterService } from '../lending-program-parameter/lending-program-parameter.service';
import { CollateralService } from '../collateral/collateral.service';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { ICertificateInfo } from './certificate-info/certificate-info.model';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { ViewportScroller } from '@angular/common';
import { BusinessActivityService } from '../credit-proposal/busines-activity/business-activity.service';

@Component({
  selector: 'jhi-offering-letter-main',
  templateUrl: './offering-letter-main.component.html',
  styleUrls: ['./offering-letter-main.css'],
})
export class OfferingLetterMainComponent implements OnInit {
  @ViewChild('creditProposalCollateralInfoComponent', {
    static: false,
  })
  creditProposalCollateralInfoComponent: CreditProposalCollateralInfoComponent;
  private id: number;
  public collateral: ICollateral[];
  public collateralProperties: ICollateralProperty[] = [];
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

  public resAttr: any;
  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  public dataOfferingSPPK = [];
  public isHistoryExist: boolean;
  public proposType = [];
  private KEYG = 'credit_proposal/summary';
  public isOpen = false;
  public dataBuilding: any;
  public dataLand: any;
  private menuId = '';

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
    protected reportUtils: ReportUtilService,
    private storageService: StorageService,
    private http: HttpClient,
    private generalParameterService: GeneralParameterService,
    private lendingProgramParameterService: LendingProgramParameterService,
    protected collateralService: CollateralService,
    protected collateralPropertyService: CollateralPropertyService,
    private baService: BusinessActivityService,
    private viewport: ViewportScroller
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['offeringLetter'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.applicationRole = new ApplicationRole();

    this.activeRoute = this.router.url.replace(/\//g, '');
    this.url = this.parentPath;

    this.selectedMenu = 'credit-proposal-summary';

    if (this.url === 'finalize') {
      if (this.creditProposal.attributes['previousOfferingLetter']) {
        this.subMenu = [
          ...SUBMENU_OFFERING_LETTER_FINALIZE,
          {
            id: 'memo-banding',
            text: 'Memo Banding',
          },
        ];
      } else {
        this.subMenu = SUBMENU_OFFERING_LETTER_FINALIZE;
      }
    } else {
      if (this.creditProposal.attributes['previousOfferingLetter']) {
        this.subMenu = [
          ...SUBMENU_OFFERING_LETTER,
          {
            id: 'memo-banding',
            text: 'Memo Banding',
          },
        ];
      } else {
        this.subMenu = SUBMENU_OFFERING_LETTER;
      }
    }

    // this.subMenu = this.url === 'finalize' ? SUBMENU_OFFERING_LETTER_FINALIZE : SUBMENU_OFFERING_LETTER;
    this.isHistoryExist = this.creditProposal.attributes.previousHistory ? true : false;

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
    this.getTitleUrl();
    this.setTitleMenuByParentPath();

    this.baService.isLoading$.subscribe(res => {
      this.baLoading = res;
      console.log('Isloadingg', this.baLoading);
    });
    this.baService.progress$.subscribe(res => {
      this.progress = res;
      console.log('Progress', this.progress);
    });
  }

  public progress: number;
  public baLoading: Boolean = false;

  private setTitleMenuByParentPath() {
    if (this.parentPath === 'distribution') {
      this.title = 'Offering Letter Distribution';
      this.menuId = 'DISTRIBUTION_OFFERING_LETTER';
    }
    if (this.parentPath === 'finalize') {
      this.title = 'Offering Letter Finalize';
      this.menuId = 'FINALIZE_OFFERING_LETTER';
    }
    if (this.parentPath === 'review') {
      this.title = 'Offering Letter Review';
      this.menuId = 'OFFERING_LETTER_REVIEW';
    }
    if (this.parentPath === 'confirmation') {
      this.title = 'Offering Letter Confirmation';
      this.menuId = 'OFFERING_LETTER_CONFIRMATION';
    }
  }

  public onAssignTo(ev) {
    let dynAttr = 'dataAssignTo';

    if (this.url === 'la-distribution') {
      dynAttr = 'dataAssignToCRO';
    } else if (this.url === 'cc-distribution') {
      dynAttr = 'dataAssignToCCAdmin';
    } else if (this.url === 'distribution') {
      dynAttr = 'dataAssignToLegalOfficer';
    }

    this.applicationRole = ev;
    this.creditProposal.attributes[dynAttr] = ev;
  }

  private saveApplicationRole(source: string): void {
    if (source === 'process') {
      this.creditProposalProcessService.processTask(this.resAttr).subscribe(() => {
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
    } */
  }

  private saveCollateralInfo(source: string): void {
    if (this.creditProposalCollateralInfoComponent) {
      this.creditProposalCollateralInfoComponent.triggeredSave(this.creditProposal.attributes.proposalType);
    }

    if (source === 'process') {
      this.creditProposalProcessService.processTask(this.resAttr).subscribe(() => {
        this.router.navigate([this.router.url.split('/')[1]]);
      });
    } else if (source === 'default') {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });
    }
  }

  ngOnInit() {
    this.lendingProgramParameter();
    this.lovProposalType();
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

    this.getBucketNameSummary();

    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
  }

  private getTasks(): void {
    // this.creditProposalProcessService.getTasks(this.id).subscribe(res => {
    this.creditProposalProcessService.getTasksByPos(this.id, { idPosition: this.getLocStor('POS'), idMenu: this.menuId }).subscribe(res => {
      this.tasks = res.body;
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

  public processTask(task: IProcessTask): void {
    const dialogRef = this.dialog.open(TaskCommentDialogComponent, {
      width: '80vw',
      data: { processTask: task },
    });
    dialogRef.afterClosed().subscribe(_res => {
      if (_res) {
        this.resAttr = _res;
        this.resAttr.attr.idPosition = this.getLocStor('POS');
        this.resAttr.attr['idApplication'] = this.creditProposal.id;
        this.onSave('process');
      }
    });
  }

  print() {
    const id = this.item.id;
    this.reportUtils.downloadFile2('/services/report/api/report/spkk/word-stream/' + id, '', 'Report_' + id);
  }

  public goToSubMenu(menu: string): void {
    this.selectedMenu = menu;
  }

  public routeSubMenu(menu: object): void {
    const routeHelper =
      this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3].substr(0, 4);
    this.router.navigate([routeHelper], { queryParams: { subroute: menu['id'] } });
  }

  private preSave(): ICreditProposal {
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

    copyCreditProposal.attributes['certificateInfoData'] = JSON.stringify(copyCreditProposal.attributes['certificateInfoData']);
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
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = applicationRolePreSave.id
        ? JSON.stringify(applicationRolePreSave)
        : JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    } else {
      copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
      copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
      copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    }

    copyCreditProposal.attributes['coverageTotal'] = JSON.stringify(copyCreditProposal.attributes['coverageTotal']);
    copyCreditProposal.attributes['lendingProgramParameter'] = JSON.stringify(copyCreditProposal.attributes['lendingProgramParameter']);
    copyCreditProposal.attributes['collateralGroup'] = JSON.stringify(copyCreditProposal.attributes['collateralGroup']);
    return copyCreditProposal;
  }

  public onSave(source: string): void {
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.preSave()).subscribe(res => {
        this.saveCollateralInfo(source);
        // this.saveApplicationRole(source);
      });
    } else {
      this.creditProposalService.create(this.preSave()).subscribe(res => {
        this.saveCollateralInfo(source);
        // this.saveApplicationRole(source);
      });
    }
  }

  getTitleUrl() {
    const x = this.router.url.split('/')[3];
    this.titleUrl = x;
  }

  getText(value: any) {
    if (value === 'distribution') {
      this.title = 'Offering Letter Distribution';
    }
    if (value === 'finalize') {
      this.title = 'Offering Letter Finalize';
    }
    if (value === 'review') {
      this.title = 'Offering Letter Review';
    }
    if (value === 'confirmation') {
      this.title = 'Offering Letter Confirmation';
    }
    return this.title;
  }

  public showTextMenu(): void {
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

        this.dataOfferingSPPK = data;
      });
  }

  private generate(): void {
    this.generateFileOfferingSPPK().then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File Generated Successfully',
      });
      this.onRefresh();
    });
  }

  private async generateFileOfferingSPPK(): Promise<void> {
    const fileSPPK = await firstValueFrom(
      this.http.get('/services/report/api/report/spkk/pdf-word/' + this.id, { responseType: 'text', observe: 'response' })
    );
    const genrateSPPK = await firstValueFrom(
      this.http.get('/services/report/api/report/spkk/word/' + this.id, { responseType: 'text', observe: 'response' })
    );
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
            this.findCollateralProperty(this.collateral[i], i);
          }
        }
      });
  }

  public findCollateralProperty(collateral: ICollateral, i): void {
    if (collateral.id) {
      this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
        this.collateralProperties = [...this.collateralProperties, ...res.body];
        if (this.collateral.length === i + 1) {
          this.setCertificate(this.collateral);
        }
      });
    }
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
                  certificate.luasTanah = this.findPropertyLand('luasTanah', collateral[i]);
                  certificate.luasBangunan = this.findPropertyLand('luasBangunan', collateral[i]);
                  this.creditProposal.attributes['certificateInfoData'].push(certificate);
                }
              }
            }
          }
          if (collateral[i].collateralTypeId === 'VEHICLE') {
            this.collateralPropertyService
              .queryFilterBy({
                idCollateral: collateral[i].id,
                size: 9999,
                page: 0,
                idPropertyType: CollateralPropertyType.VEHICLE,
              })
              .subscribe(res => {
                if (res.body) {
                  for (let j = 0; j < res.body.length; j++) {
                    const certificate: ICertificateInfo = {};
                    certificate.id = collateral[i].id;
                    certificate.buktiKepemilikan = res.body[j].bpkbNum;
                    this.creditProposal.attributes['certificateInfoData'].push(certificate);
                  }
                }
              });
          }
          if (collateral[i].collateralTypeId === 'MACHINE') {
            this.collateralPropertyService
              .queryFilterBy({
                idCollateral: collateral[i].id,
                page: 0,
                size: 9999,
                idPropertyType: CollateralPropertyType.MACHINE,
              })
              .subscribe(res => {
                if (res.body) {
                  for (let j = 0; j < res.body.length; j++) {
                    const certificate: ICertificateInfo = {};
                    certificate.id = collateral[i].id;
                    certificate.buktiKepemilikan = res.body[j].machineDocType + ' ' + res.body[j].machineDocNum;
                    this.creditProposal.attributes['certificateInfoData'].push(certificate);
                  }
                }
              });
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
  public findPropertyLand(type: string, collateral: ICollateral) {
    this.dataLand = lodash.find(this.collateralProperties, function (o) {
      return o.propertyType === 'LAND' && o.collateralId === collateral.id && o.external === false;
    });
    this.dataBuilding = lodash.find(this.collateralProperties, function (o) {
      return o.propertyType === 'BUILDING' && o.collateralId === collateral.id && o.external === false;
    });
    if (this.dataLand) {
      if (type === 'luasTanah') {
        return this.dataLand.landSizePerCertificate;
      }
    }
    if (this.dataBuilding) {
      if (type === 'luasBangunan') {
        return this.countTotalArea(this.dataBuilding.attributes['floors']);
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
      console.log('properties ', this.collateralProperties);
      console.log('ini data ', data);
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
  public previousState(): void {
    window.history.back();
  }

  // offering letter / confirmation
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

  // scroll-up

  readonly showScroll$: Observable<boolean> = fromEvent(window, 'scroll').pipe(map(() => this.viewport.getScrollPosition()?.[1] > 0));

  onScrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
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
