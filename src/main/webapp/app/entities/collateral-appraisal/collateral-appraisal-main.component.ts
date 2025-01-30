import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ICollateralAppraisal } from './collateral-appraisal.model';
import { IPerson, Person } from '../person/person.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { ICollateral, Collateral } from '../collateral/collateral.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { CollateralAppraisalProcessService } from './collateral-appraisal-process.service';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { FieldSettingsModel } from '@syncfusion/ej2-angular-navigations';

import { IProcessTask } from 'app/shared/model/process-task.model';
import { IScoreCard } from './negative/score-card.constant';

import { ICif, Cif } from '../cif/cif.model';
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import { ISurveyAppraisals, SurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';
import { PartyPostalAddressService } from '../party-postal-address/party-postal-address.service';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';
import lodash from 'lodash';
import { IPartyPostalAddress, PartyPostalAddress } from '../party-postal-address/party-postal-address.model';

import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';
import {
  SUBMENU_COLLATERAL_APPRAISAL,
  SUBMENU_COLLATERAL_APPRAISAL_ADMIN,
  SUBMENU_COLLATERAL_APPRAISAL_MACHINE,
  SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL,
  SUBMENU_COLLATERAL_APPRAISAL_REALESTATE,
  SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL_REALESTATE,
} from 'app/shared/constants/base.constants';
import { IOptionNode } from 'app/shared/model/option-node.model';
import {
  MINIMUM_COMPARISON_DATA,
  MINIMUM_DOCUMENT_COLLATERAL,
  MINIMUM_DOCUMENT_LAINYA,
  MINIMUM_LAND_DETAIL,
  MINIMUM_MACHINE_DETAIL,
  MINIMUM_OBJECT_JAMINAN_DATA,
  MINIMUM_VEHCICLE_DETAIL,
  MINIMUM_BUILDING_DETAIL,
  MINIMUM_CERTIFICATE,
} from 'app/shared/constants/config.constants';
import { Authority } from 'app/config/authority.constants';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { StorageService } from '../storage/storage.service';
import { STATUS } from 'app/shared/constants/status.constants';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralAppraisalProcessComponent } from './foto/collateral-appraisal-process.component';
import { CollateralAppraisalForwardToComponent } from './summary/forward-to/collateral-appraisal-forward-to.component';
import { POSITION_TYPE } from 'app/shared/constants/base.constants';
import { DocumentComponent } from '../document/document.component';
import { CollateralAppraisalDetailProcessLandComponent } from './collateral/collateral-appraisal-process-detail-land.component';
import { CollateralAppraisalDetailProcessUnitConditionComponent } from './collateral/collateral-appraisal-process-detail-unit-condition.component';
import { CollateralAppraisalDetailProcessMesinComponent } from './collateral/collateral-appraisal-process-detail-mesin.component';
import { CollateralAppraisalComparisonComponent } from './comparison/collateral-appraisal-comparison.component';
import { CollateralAppraisalDetailProcessLandCertificatesComponent } from './collateral/collateral-appraisal-process-detail-land-certificates.component';
import { CollateralAppraisalSummaryComponent } from './summary/collateral-appraisal-summary.component';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { CollateralAppraisalValuationPropertyComponent } from './valuation/details/collateral-appraisal-valuation-property.component';

@Component({
  providers: [
    CollateralAppraisalProcessComponent,
    CollateralAppraisalComparisonComponent,
    CollateralAppraisalForwardToComponent,
    CollateralAppraisalDetailProcessLandCertificatesComponent,
    DocumentComponent,
    CollateralAppraisalDetailProcessLandComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
    CollateralAppraisalDetailProcessMesinComponent,
    CollateralAppraisalValuationPropertyComponent,
  ],
  selector: 'jhi-collateral-appraisal-main',
  templateUrl: './collateral-appraisal-main-floating.component.html',
  styleUrls: ['./collateral-appraisal-main.css'],
})
export class CollateralAppraisalMainComponent implements OnInit {
  @ViewChild('collateralAppraisalSummaryComponent', {
    static: false,
  })
  collateralAppraisalSummaryComponent: CollateralAppraisalSummaryComponent;
  public parentPath = this.router.url.split('/')[1];
  public wilayahKotaExternalValue?: string;
  public teamReviewerValue: string;
  public kjppIndependentAppraisalValue?: string;
  public clickedMenu: string;
  public approveDate: string;
  public visitedDate: string;
  public checkedData: boolean;
  public timeLineStatus: any[];
  private resProcess: any;
  private taskProcess: IProcessTask;
  private _collateralAppraisal: ICollateralAppraisal;
  public isOpen = false;
  appName: any;
  appNameMenu: any;
  appraisalValidity: any;
  public valuationData: any[] = [];
  get collateralAppraisal() {
    return this._collateralAppraisal;
  }

  set collateralAppraisal(item: ICollateralAppraisal) {
    this.documentComponent.documentLainnya(item.id);
    this.loadData(item.collateral);

    this._collateralAppraisal = item;

    this.collateralAppraisalProcessComponent.getFilesByKey(`/appraisals/${item.id}/jaminan`);
    this.getWord();

    if (item.collateral.propertyUsage !== '') {
      this.checkedData = true;
    }
  }

  private _surveyAppraisal: ISurveyAppraisals;
  get surveyAppraisal() {
    return this._surveyAppraisal;
  }

  set surveyAppraisal(item: ISurveyAppraisals) {
    this._surveyAppraisal = item;
    if (item.collateral !== undefined) {
      this.documentComponent.documentCollateral(item.collateral.id);
    }

    // Get Foto Object Jaminan
    this.storageService.getBucketName().subscribe(res => {
      this.storageService
        .getObjects(res.body['bucket'], {
          key: `/appraisals/${this.collateralAppraisal.id}/jaminan`,
        })
        .subscribe((result: any) => {
          this.collateralAppraisalService.totalDataFotoObjectJaminan = result.body;
        });
    });

    this.documentCollateralComponent.getCollateralPropertyByCollateralId(item.collateralId);
    this.collateralAppraisalDetailProcessLandComponent.propertyData(item.collateralId, CollateralPropertyType.LAND);
    this.collateralAppraisalDetailProcessUnitConditionComponent.getCollateralPropertyByCollateralId(item.collateralId);
    this.collateralAppraisalDetailProcessMesinComponent.collateralProperties(item.collateralId);
  }

  public collateralProp: ICollateralProperty;
  private id: number;
  public tasks: IProcessTask[] = new Array<IProcessTask>();
  private currentAccount: Account;
  public accountAuthorities?: Object[];
  public postalAddress: IPartyPostalAddress;

  public creditProposal: ICreditProposal;
  public subMenu: object[];
  public collateralProperties: ICollateralProperty[];
  public bucket: string;
  public fotoObjectJaminan: any;
  public keteranganObjectJaminan: any;
  public ketObjekJaminan: Boolean;

  constructor(
    protected applicationStateLogService: ApplicationStateLogService,
    private collateralAppraisalProcessService: CollateralAppraisalProcessService,
    private collateralAppraisalService: CollateralAppraisalService,
    private surveyAppraisalsService: SurveyAppraisalsService,
    private creditProposalService: CreditProposalService,
    public accountService: AccountService,
    private partyPostalAddressService: PartyPostalAddressService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    public collateralAppraisalProcessComponent: CollateralAppraisalProcessComponent,
    public collateralAppraisalForwardToComponent: CollateralAppraisalForwardToComponent,
    public documentComponent: DocumentComponent,
    public collateralAppraisalDetailProcessLandCertificatesComponent: CollateralAppraisalDetailProcessLandCertificatesComponent,
    public documentCollateralComponent: CollateralAppraisalComparisonComponent,
    public collateralAppraisalDetailProcessLandComponent: CollateralAppraisalDetailProcessLandComponent,
    public collateralAppraisalDetailProcessUnitConditionComponent: CollateralAppraisalDetailProcessUnitConditionComponent,
    public collateralAppraisalDetailProcessMesinComponent: CollateralAppraisalDetailProcessMesinComponent,
    public collateralAppraisalValuationPropertyComponent: CollateralAppraisalValuationPropertyComponent
  ) {
    this.postalAddress = new PartyPostalAddress();
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.collateralAppraisal = this.activatedRoute.snapshot.data['content'];

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.clickedMenu = subRoute;
      } else {
        this.clickedMenu = 'appraisal-info';
      }
    });
    this.timeLineStatus = [];
    this.visitedDate = '';
    this.approveDate = '';
    this.surveyAppraisal = new SurveyAppraisals();
    const obj = {
      key: 'appraisals/remark/keterangan-objek-jaminan/' + this.collateralAppraisal.id + '/sfdt',
    };
    this.storageService.getObjects('hana', obj).subscribe(response => {
      this.keteranganObjectJaminan = response.body;
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

  public menuFields: FieldSettingsModel = {
    text: ['text'],
  };
  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [];
  public menuItemsAll: MenuItemModel[] = [
    { text: 'Appraisal Info' },
    { text: 'Customer Info' },
    { text: 'Collateral Info' },
    { text: 'Valuation' },
    { text: 'Comparison Data' },
    { text: 'Foto Objek Jaminan' },
    { text: 'Summary' },
  ];
  public menuItemsMin: MenuItemModel[] = [{ text: 'Appraisal Info' }, { text: 'Customer Info' }, { text: 'Collateral Info' }];
  public collateralAppraisalMainRolesAccess = [
    {
      role: 'ROLE_ADMIN',
      isAuthorized: false,
    },
    {
      role: 'ROLE_RM',
      isAuthorized: false,
    },
    {
      role: 'ROLE_ADMIN_APPRAISER',
      isAuthorized: false,
    },
    {
      role: 'ROLE_SURVEYOR',
      isAuthorized: false,
    },
  ];

  public partyType: string;
  public person: IPerson = new Person();
  public partyGroup: IPartyGroup = new PartyGroup();
  public cif?: ICif = new Cif();
  public collateralType: string;
  public collateral: ICollateral = new Collateral();

  public collateralProperty: ICollateralProperty[];
  public tipeOfficerAppraisal?: string;

  public jpRenewal;
  public jpNew;
  public jpAdditional;
  public jpProgress;
  public jpOther;
  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
      this.accountAuthorities = account['authorities'];
      if (lodash.indexOf(this.accountAuthorities, 'ROLE_ADMIN') >= 0) {
        this.subMenu =
          this.collateralAppraisal.collateral.collateralTypeId === 'REALESTATE'
            ? SUBMENU_COLLATERAL_APPRAISAL_REALESTATE
            : SUBMENU_COLLATERAL_APPRAISAL;
      } else {
        if (
          lodash.indexOf(this.accountAuthorities, 'ROLE_ADMIN_APPRAISER') >= 0 ||
          lodash.indexOf(this.accountAuthorities, 'ROLE_RM') >= 0
        ) {
          if (
            this.collateralAppraisal.statusId === 'DRAFT' ||
            this.collateralAppraisal.statusId === 'RETURN_TO_RM' ||
            this.collateralAppraisal.statusId === 'ASSIGNMENT' ||
            this.collateralAppraisal.statusId === 'VISITED'
          ) {
            this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_ADMIN;
          } else {
            this.subMenu =
              this.collateralAppraisal.collateral.collateralTypeId === 'REALESTATE'
                ? SUBMENU_COLLATERAL_APPRAISAL_REALESTATE
                : SUBMENU_COLLATERAL_APPRAISAL;
          }
        } else {
          this.subMenu =
            this.collateralAppraisal.collateral.collateralTypeId === 'REALESTATE'
              ? SUBMENU_COLLATERAL_APPRAISAL_REALESTATE
              : SUBMENU_COLLATERAL_APPRAISAL;
        }
      }
    });
    this.setAuthorizedRole();
    this.selectedMenu = 'Appraisal Info';
    this.setMenuByRole();
    this.getCustomerInfo();
    this.getDataSurveyAppraisal().then(res => {
      this.onValTipeOfficerAppraisalChanged(this.surveyAppraisal.apprOfficer);
      this.loadPartyPostalAddress(this.surveyAppraisal.cif.partyId);

      this.creditProposalService.find(this.surveyAppraisal.applicationId).subscribe(resCreditProposal => {
        this.creditProposal = resCreditProposal.body;
        if (this.creditProposal.attributes['correspondence']) {
          if (this.creditProposal.attributes['correspondence'].length > 0) {
            this.creditProposal.attributes['correspondence'] = JSON.parse(this.creditProposal.attributes['correspondence']);
          }
        }
      });
      this.loadProperty(this.collateral);
      this.getValuationMVLV();
    });
    this.getTasks();
    this.timeLine();
  }

  public timeLine() {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('APPRAISAL', this.id).subscribe(res => {
      this.timeLineStatus = res.body;
    });
  }

  private loadPartyPostalAddress(partyId: string): void {
    this.partyPostalAddressService.queryFilterBy({ idParty: partyId }).subscribe(res => {
      if (res.body.length > 0) {
        this.postalAddress = lodash.find(res.body, function (o) {
          return o.purposeTypeId === 'PRIMARY_LOCATION';
        });
      }
    });
  }

  private ngUnsubscribe = new Subject();
  public totalKeteranganObjectJaminan;
  // get keterangan objek jaminan
  private getContainer(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'appraisals/remark/keterangan-objek-jaminan/' + paramsId + '/sfdt',
    };

    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        this.totalKeteranganObjectJaminan = response.body;
      });
  }

  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.bucket = val.body['bucket'];
      this.getContainer();
    });
  }

  private getDataSurveyAppraisal(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.find(this.id).subscribe(res => {
        this.surveyAppraisal = res.body;

        this.collateral = this.surveyAppraisal.collateral;
        this.collateralType = this.collateral.collateralTypeId;
        this.onValTipeOfficerAppraisalChanged(this.surveyAppraisal.apprOfficer);
        this.loadProperty(this.surveyAppraisal.collateral);
        resolve();
      });
    });
  }

  private getCustomerInfo(): void {
    this.partyType = this._collateralAppraisal.partyTypeId === 'PERSON' ? 'Individual' : 'Corporate';
    this.getSurveyAppraisal(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  private getTasks(): void {
    // this.collateralAppraisalProcessService.getTasks(this.id).subscribe(res => {
    this.collateralAppraisalProcessService
      .getTasksByPos(this.id, {
        idPosition: this.getLocStor('POS'),
        idMenu: this.parentPath === 'collateral-appraisal' ? 'REQUEST_APPRAISAL' : 'APPRAISAL_RESULT_INQUIRY',
      })
      .subscribe(res => {
        this.tasks = res.body;
      });
  }
  public setAppraisalValidity(ev) {
    this.appraisalValidity = ev;
  }

  public setNew(ev) {
    this.jpNew = ev;
  }
  public setRenewal(ev) {
    this.jpRenewal = ev;
  }
  public setAdditional(ev) {
    this.jpAdditional = ev;
  }
  public setProgress(ev) {
    this.jpProgress = ev;
  }
  public setOther(ev) {
    this.jpOther = ev;
  }

  public processTask(task: IProcessTask): void {
    const dialogRef = this.dialog.open(TaskCommentDialogComponent, {
      width: '80vw',
      data: { processTask: task },
    });
    dialogRef.afterClosed().subscribe(_res => {
      if (_res) {
        this.resProcess = _res;
        this.resProcess.attr.idPosition = this.getLocStor('POS');
        this.taskProcess = task;
        if (_res.name === 'return' || _res.name === 'cancel') {
          this.saveProcess();
        } else {
          this.onSave('process');
        }
      }
    });
  }

  private getSurveyAppraisal(cifId: string): void {
    this.surveyAppraisalsService.find(cifId).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
      this.cif = res.body['cif'] !== null ? res.body['cif'] : new Cif();
      this.getConditionSubMenu(res.body);
    });
  }

  public getConditionSubMenu(data): void {
    if (data.apprOfficer === 'External') {
      if (this.collateralAppraisal.statusId === 'DRAFT' || this.collateralAppraisal.statusId === 'RETURN_TO_RM') {
        this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_ADMIN;
      } else {
        this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL;
      }
    }
  }

  public addNewCriteria(data: IScoreCard[]): void {
    this.collateralAppraisal.attributes['scoreCard'] = data;
  }

  private preSave(): ISurveyAppraisals {
    const copySurveyAppraisal = lodash.cloneDeep(this.surveyAppraisal);
    console.log('Copy SurveyAppraisal: ', this.surveyAppraisal);

    copySurveyAppraisal.attributes['scoreCard'] = JSON.stringify(this.collateralAppraisal.attributes['scoreCard']);

    if (typeof copySurveyAppraisal.attributes['marketbility'] === 'object') {
      copySurveyAppraisal.attributes['marketbility'] = JSON.stringify(this.collateralAppraisal.attributes['marketbility']);
    } else {
      copySurveyAppraisal.attributes['marketbility'] = this.collateralAppraisal.attributes['marketbility'];
    }

    if (typeof copySurveyAppraisal.collateral.attributes['landCertificates'] === 'object') {
      copySurveyAppraisal.collateral.attributes['landCertificates'] = JSON.stringify(
        copySurveyAppraisal.collateral.attributes['landCertificates']
      );
    } else {
      copySurveyAppraisal.collateral.attributes['landCertificates'];
    }
    return copySurveyAppraisal;
  }

  public onAssignTo(ev) {
    this.surveyAppraisal = ev;
  }

  private saveProcess(): void {
    this.collateralAppraisalProcessService.processTask(this.resProcess).subscribe(res => {
      this.getTasks();
      this.router.navigate(['/collateral-appraisal']);
    });
  }

  private mainSave(source: string): void {
    const copySurveyAppraisal: ISurveyAppraisals = this.preSave();

    if (copySurveyAppraisal.id) {
      this.surveyAppraisalsService.update(copySurveyAppraisal).subscribe(res => {
        this.getTasks();
        this.saveMVLV(copySurveyAppraisal);

        this.surveyAppraisal.surveyorId = res.body.surveyorId;
        this.surveyAppraisal.surveyorPersonId = res.body.surveyorPersonId;
        this.collateralAppraisal.surveyorId = res.body.surveyorId;
        this.collateralAppraisal.surveyorPersonId = res.body.surveyorPersonId;
        if (source === 'process') {
          this.saveProcess();
          if (this.collateralAppraisalSummaryComponent) {
            this.collateralAppraisalSummaryComponent.triggeredSave();
            this.getWord();
          }
        } else if (source === 'default') {
          if (this.collateralAppraisalSummaryComponent) {
            this.collateralAppraisalSummaryComponent.triggeredSave();
            this.getWord();
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save Success' });
        }
      });
    } else {
      this.surveyAppraisalsService.create(copySurveyAppraisal).subscribe(res => {
        this.saveMVLV(copySurveyAppraisal);

        this.surveyAppraisal.surveyorId = res.body.surveyorId;
        this.surveyAppraisal.surveyorPersonId = res.body.surveyorPersonId;
        this.collateralAppraisal.surveyorId = res.body.surveyorId;
        this.collateralAppraisal.surveyorPersonId = res.body.surveyorPersonId;
        if (source === 'process') {
          if (this.collateralAppraisalSummaryComponent) {
            this.collateralAppraisalSummaryComponent.triggeredSave();
            this.getWord();
          }
          this.saveProcess();
        } else if (source === 'default') {
          if (this.collateralAppraisalSummaryComponent) {
            this.collateralAppraisalSummaryComponent.triggeredSave();
            this.getWord();
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save Success' });
        }
      });
    }
  }
  public onSave(source: string): void {
    this.ketObjekJaminan = true;
    if (source === 'process') {
      // validate
      this.validateAppraisal().then(() => this.mainSave(source));
      this.cekValuation();
    } else {
      this.mainSave(source);
      this.cekValuation();
    }
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  private setAuthorizedRole(): void {
    for (let i = 0; i < this.collateralAppraisalMainRolesAccess.length; i++) {
      this.collateralAppraisalMainRolesAccess[i].isAuthorized = this.checkAuthority(this.collateralAppraisalMainRolesAccess[i]);
    }
  }

  private checkAuthority(collateralAppraisalMainRolesAccess: any) {
    if (this.accountService.hasAnyAuthority(collateralAppraisalMainRolesAccess.role)) {
      return true;
    }
    return false;
  }

  private setMenuByRole(): void {
    for (let i = 0; i < this.collateralAppraisalMainRolesAccess.length; i++) {
      if (
        this.collateralAppraisalMainRolesAccess[i].role === Authority.ADMIN &&
        this.collateralAppraisalMainRolesAccess[i].isAuthorized === true
      ) {
        this.menuItems = this.menuItemsAll;
        break;
      } else if (
        this.collateralAppraisalMainRolesAccess[i].role === Authority.RM &&
        this.collateralAppraisalMainRolesAccess[i].isAuthorized === true
      ) {
        this.menuItems = this.menuItemsMin;
        break;
      } else if (
        this.collateralAppraisalMainRolesAccess[i].role === Authority.ADMIN_APPRAISER &&
        this.collateralAppraisalMainRolesAccess[i].isAuthorized === true
      ) {
        this.menuItems = this.menuItemsMin;
        break;
      } else if (
        this.collateralAppraisalMainRolesAccess[i].role === Authority.SURVEYOR &&
        this.collateralAppraisalMainRolesAccess[i].isAuthorized === true
      ) {
        this.menuItems = this.menuItemsAll;
        break;
      }
    }
  }

  public onValTipeOfficerAppraisalChanged(ev: any): void {
    let isRoleSU = false;
    let isRoleRM = false;
    let isRoleAdmin = false;
    let isRoleAppraisalOfficer = false;

    if (this.accountService.hasAnyAuthority(Authority.ADMIN)) {
      isRoleSU = true;
    }

    if (this.accountService.hasAnyAuthority(Authority.RM)) {
      isRoleRM = true;
    }

    if (this.accountService.hasAnyAuthority(Authority.ADMIN_APPRAISER)) {
      isRoleAdmin = true;
    }

    if (this.accountService.hasAnyAuthority(Authority.SURVEYOR)) {
      isRoleAppraisalOfficer = true;
    }

    if (isRoleAppraisalOfficer || isRoleSU) {
      this.tipeOfficerAppraisal = ev;
      this.getMenuAppraisalOfficer(ev);
    }
  }

  public previousState(): void {
    window.history.back();
  }

  private getMenuAppraisalOfficer(ev: any): void {
    if (ev === 'external') {
      this.menuItems = [
        { text: 'Appraisal Info' },
        { text: 'Customer Info' },
        { text: 'Collateral Info' },
        { text: 'External Officer Info' },
      ];
    } else {
      if (this.collateralType === 'PROPERTY' || this.collateralType === 'REALESTATE') {
        this.menuItems = [
          { text: 'Appraisal Info' },
          { text: 'Customer Info' },
          { text: 'Collateral Info' },
          { text: 'Valuation' },
          { text: 'Negative Collateral' },
          { text: 'Comparison Data' },
          { text: 'Foto Objek Jaminan' },
          { text: 'Summary' },
        ];
      } else {
        this.menuItems = [
          { text: 'Appraisal Info' },
          { text: 'Customer Info' },
          { text: 'Collateral Info' },
          { text: 'Valuation' },
          { text: 'Comparison Data' },
          { text: 'Foto Objek Jaminan' },
          { text: 'Summary' },
        ];
      }
    }
  }

  public checkCompletedData(node: IOptionNode): boolean {
    if (node.id === 'comparison-data') {
      if (this.collateralAppraisalService.totalDataComparison.length >= MINIMUM_COMPARISON_DATA) {
        return true;
      }
    } else if (node.id === 'valuation') {
      if (
        this.collateralAppraisal.collateral.collateralTypeId === 'PROPERTY' ||
        this.collateralAppraisal.collateral.collateralTypeId === 'REALESTATE'
      ) {
        let dataLand = [];
        let dataBuilding = [];

        if (this.collateralAppraisalService.totalDataValuationLand.length >= 0) {
          dataLand = this.collateralAppraisalService.totalDataValuationLand.filter(
            obj => obj.propertyMarketValue === null || obj.propertyPercentage === null
          );

          if (dataLand.length === 0) {
            if (this.collateralAppraisalService.totalDataValuationBuilding.length >= 0) {
              dataBuilding = this.collateralAppraisalService.totalDataValuationBuilding.filter(
                obj => obj.propertyMarketValue === null || obj.propertyPercentage === null
              );

              if (dataBuilding.length === 0) {
                return true;
              }
            }
          }
        }
      } else if (this.collateralAppraisal.collateral.collateralTypeId === 'VEHICLE') {
        let dataVehicle = [];

        if (this.collateralAppraisalService.totalDataDetailVehicle.length > 0) {
          dataVehicle = this.collateralAppraisalService.totalDataDetailVehicle.filter(
            obj => obj.vehicleMarketValue === null || obj.vehicleMarketValue === null
          );
          if (dataVehicle.length === 0) {
            return true;
          }
        }
      } else if (this.collateralAppraisal.collateral.collateralTypeId === 'MACHINE') {
        let dataMachine = [];
        if (this.collateralAppraisalService.totalDataDetailMachine.length >= 0) {
          dataMachine = this.collateralAppraisalService.totalDataDetailMachine.filter(
            obj => obj.machineMarketValue === null || obj.machinePercentage === null
          );
          if (dataMachine.length === 0) {
            return true;
          }
        }
      }
    } else if (node.id === 'customer-info') {
      return true;
    } else if (node.id === 'appraisal-info') {
      return true;
    } else if (node.id === 'summary') {
      if (this.collateralAppraisal.attributes['marketbility'] !== '' && this.totalKeteranganObjectJaminan > 0) {
        return true;
      } else {
        return false;
      }
    } else if (node.id === 'negative-collateral') {
      return true;
    } else if (node.id === 'foto-object-jaminan') {
      if (this.collateralAppraisalService.totalDataFotoObjectJaminan.length >= MINIMUM_OBJECT_JAMINAN_DATA) {
        return true;
      }
    } else if (node.id === 'collateral-info') {
      if (
        this.collateralAppraisalService.totalDataDocumentCollateral.length >= MINIMUM_DOCUMENT_COLLATERAL &&
        this.collateralAppraisalService.totalDataDocumentLainya.length >= MINIMUM_DOCUMENT_LAINYA
      ) {
        if (
          this.collateralAppraisal.collateral.collateralTypeId === 'PROPERTY' ||
          this.collateralAppraisal.collateral.collateralTypeId === 'REALESTATE'
        ) {
          if (this.collateralAppraisalService.totalDataDetailLand.length >= MINIMUM_LAND_DETAIL) {
            const collateral = this.surveyAppraisal.collateral;

            if (
              collateral.attributes.borwd !== '' &&
              collateral.propertyUsage !== '' &&
              collateral.landShape !== '' &&
              collateral.roadWidth !== 0 &&
              collateral.unitCondition !== '' &&
              collateral.inhabitedBy !== '' &&
              collateral.landPosition !== '' &&
              collateral.facingDirection !== '' &&
              collateral.madeWith !== '' &&
              collateral.leftSide !== '' &&
              collateral.rightSide !== '' &&
              collateral.frontSide !== '' &&
              collateral.backSide !== ''
            ) {
              return true;
            } else {
              return false;
            }
          }
        } else if (this.collateralAppraisal.collateral.collateralTypeId === 'VEHICLE') {
          if (this.collateralAppraisalService.totalDataDetailVehicle.length >= MINIMUM_VEHCICLE_DETAIL) {
            return true;
          }
        } else if (this.collateralAppraisal.collateral.collateralTypeId === 'MACHINE') {
          if (this.collateralAppraisalService.totalDataDetailMachine.length >= MINIMUM_MACHINE_DETAIL) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public ceckData(menu: object) {
    const router = this.router.url.split('=')[1];
    if (router !== menu['id']) {
      if (this.surveyAppraisal.statusId !== 'COMPLETE') {
        this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Dont forget to save data on this page' });
        this.router.navigate(['/collateral-appraisal', this.id, 'edit'], { queryParams: { subroute: menu['id'] } });
      } else {
        this.router.navigate(['/collateral-appraisal', this.id, 'edit'], { queryParams: { subroute: menu['id'] } });
      }
    }
  }

  public routeSubMenu(menu: object): void {
    this.ceckData(menu);
  }

  private _showNotification(severity: string, message: string): void {
    // capitalize first letter for summary
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({ severity, summary: severityCaptitalized, detail: message, life: 3000 });
  }

  private _validateProcess(toValidate: object) {
    let isAllTrue = true;
    for (const key in toValidate) {
      if (Object.prototype.hasOwnProperty.call(toValidate, key)) {
        if (toValidate[key] === false) {
          isAllTrue = false;
          break;
        }
      }
    }

    return isAllTrue;
  }

  public validateAppraisal(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      switch (this.collateralAppraisal.statusId) {
        case STATUS.DRAFT:
          this.validateDraft().then(() => resolve(true));
          break;
        case STATUS.ASSIGNMENT:
          this.validateAssignment().then(() => resolve(true));
          break;
        case STATUS.ASSIGNED:
          this.validateAssigned().then(() => resolve(true));
          break;
        case STATUS.VISITED:
          this.validateVisited().then(() => resolve(true));
          break;
        case STATUS.APPROVAL_TL:
          this.validateApprovalTL().then(() => resolve(true));
          break;
        case STATUS.APPROVAL_DEPT_HEAD:
        case STATUS.APPROVAL_DH:
          this.validateVisited().then(() => resolve(true));
          break;
        default:
          resolve(true);
      }
    });
  }

  public checkMustValidatedOnApprovalTL() {
    const mustValidateOnTL = {
      jenisObject: true,
      jenisPermohonan: true,
      documentCollateral: true,
      documentLainnya: true,
      picDebtor: true,
      picPhone: true,
    };

    return this._validateProcess(mustValidateOnTL);
  }

  public checkMustValidatedOnDraft() {
    const mustValidateOnDraft = {
      jenisObject: true,
      jenisPermohonan: true,
      documentCollateral: true,
      documentLainnya: true,
      picDebtor: true,
      picPhone: true,
      totalPlafond: true,
      tglJatuhTempo: true,
    };
    if (
      this.jpRenewal === true ||
      this.jpNew === true ||
      this.jpAdditional === true ||
      this.jpProgress === true ||
      this.jpOther === true ||
      this.surveyAppraisal.jpReappraisal === true
    ) {
      if (this.surveyAppraisal.attributes['jenisObject'] === undefined || this.surveyAppraisal.attributes['jenisObject'] === '') {
        this._showNotification('error', 'Pilih Jenis Objek Dahulu');
        mustValidateOnDraft.jenisObject = false;
      }
    } else {
      this._showNotification('error', 'Pilih Jenis Permohonan Dahulu');
      mustValidateOnDraft.jenisPermohonan = false;
    }
    if (this.jpRenewal === true) {
      if (this.surveyAppraisal.totalPlafond === undefined || this.surveyAppraisal.totalPlafond === null) {
        this._showNotification('error', 'Masukkan Total Plafond Dahulu');
        mustValidateOnDraft.totalPlafond = false;
      }
      if (this.surveyAppraisal.tglJatuhTempo === undefined || this.surveyAppraisal.tglJatuhTempo === null) {
        this._showNotification('error', 'Masukkan Tanggal Jatuh Tempo');
        mustValidateOnDraft.tglJatuhTempo = false;
      }
    }
    if (this.collateralAppraisalService.totalDataDocumentCollateral.length < MINIMUM_DOCUMENT_COLLATERAL) {
      this._showNotification('error', 'Masukkan Document Collateral Dahulu');
      mustValidateOnDraft.documentCollateral = false;
    }
    if (this.collateralAppraisalService.totalDataDocumentLainya.length < MINIMUM_DOCUMENT_LAINYA) {
      this._showNotification('error', 'Masukkan Document Lainnya Dahulu');
      mustValidateOnDraft.documentLainnya = false;
    }
    if (this.collateral.picName === undefined || this.collateral.picName === '' || !this.collateral.picName) {
      this._showNotification('error', 'Masukkan PIC Debtor Dahulu');
      mustValidateOnDraft.picDebtor = false;
    }
    if (this.collateral.picPhone === undefined || !this.collateral.picPhone) {
      this._showNotification('error', 'Masukkan PIC Phone Dahulu');
      mustValidateOnDraft.picPhone = false;
    }

    return this._validateProcess(mustValidateOnDraft);
  }

  public checkMustValidatedOnAssignment() {
    const mustValidateOnAssignment = {
      wilayah: true,
      officerAppraisal: true,
      kjpp: true,
    };

    if (this.surveyAppraisal.apprOfficer === 'Internal') {
      if (!this.surveyAppraisal.surveyorArea) {
        this._showNotification('error', 'Masukkan Wilayah/Kota terlebih dahulu');
        mustValidateOnAssignment.wilayah = false;
      }
      if (!this.surveyAppraisal.surveyorPositionId) {
        this._showNotification('error', 'Masukkan Officer Appraisal terlebih dahulu');
        mustValidateOnAssignment.officerAppraisal = false;
      }
    }

    return this._validateProcess(mustValidateOnAssignment);
  }

  public checkMustValidatedOnAssigned() {
    const mustValidatedOnAssigned = {
      fotoObjectJaminan: true,
      comparisonData: true,
    };

    if (
      this.collateralAppraisalService.totalDataComparison.length < MINIMUM_COMPARISON_DATA ||
      this.collateralAppraisalService.totalDataFotoObjectJaminan.length < MINIMUM_OBJECT_JAMINAN_DATA
    ) {
      if (this.collateralAppraisal.collateral.collateralTypeId !== 'MACHINE') {
        if (this.collateralAppraisalService.totalDataComparison.length < MINIMUM_COMPARISON_DATA) {
          this._showNotification('error', 'Comparison data less than 3');
          mustValidatedOnAssigned.comparisonData = false;
        }
      }

      if (this.collateralAppraisalService.totalDataFotoObjectJaminan.length < MINIMUM_OBJECT_JAMINAN_DATA) {
        this._showNotification('error', 'Foto object jaminan data less than 6');
        mustValidatedOnAssigned.fotoObjectJaminan = false;
      }
    }

    return this._validateProcess(mustValidatedOnAssigned);
  }

  // Data land and Building
  public loadData(collateral: ICollateral): void {
    this.collateralPropertyService
      .queryFilterBy({
        idCollateral: collateral.id,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralAppraisalService.totalDataValuationLand = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.LAND;
        });
        this.collateralAppraisalService.totalDataValuationBuilding = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.BUILDING;
        });
      });
  }

  // check if key machineMarketValue has value
  public checkMachineMarketValue() {
    const machine = this.collateralAppraisalService.totalDataDetailMachine;
    // check if machineMarketValue has value
    if (machine.length > 0) {
      for (let i = 0; i < machine.length; i++) {
        if (machine[i].machineMarketValue === 0) {
          return false;
        }
      }
    }
    return true;
  }

  // check if key precentage has value
  public checkMachinePercentage() {
    const machine = this.collateralAppraisalService.totalDataDetailMachine;
    // check if machineMarketValue has value
    if (machine.length > 0) {
      for (let i = 0; i < machine.length; i++) {
        if (machine[i].percentage === 0) {
          return false;
        }
      }
    }
    return true;
  }

  public checkMustValidatedOnVisited() {
    const mustValidatedOnVisited = {
      appraisalValidity: true,
      documentCollateral: true,
      documentLainnya: true,
      fotoObjectJaminan: true,
      comparisonData: true,
      landDetail: true,
      building: true,
      certificate: true,
      marketValueM2: true,
      machineMarketValue: true,
      precentage: true,
      keterangan: true,
      marketability: true,
    };

    const landCertificate =
      this.collateralAppraisal.collateral.attributes.landCertificate &&
      JSON.parse(this.collateralAppraisal.collateral.attributes.landCertificates);
    const marketValue = {
      land: [],
      building: [],
    };

    const getMarketValueLand = this.collateralAppraisalService.totalDataValuationLand.map(obj => obj.propertyMarketValuePerMeter);
    marketValue.land.push(getMarketValueLand);

    const getMarketValueBuilding = this.collateralAppraisalService.totalDataValuationBuilding.map(obj => obj.propertyMarketValuePerMeter);
    marketValue.building.push(getMarketValueBuilding);

    if (this.collateralAppraisalService.totalDataDocumentCollateral.length < MINIMUM_DOCUMENT_COLLATERAL) {
      this._showNotification('error', 'Masukkan Document Collateral Dahulu');
      mustValidatedOnVisited.documentCollateral = false;
    }

    if (this.collateralAppraisalService.totalDataDocumentLainya.length < MINIMUM_DOCUMENT_LAINYA) {
      this._showNotification('error', 'Masukkan Document Lainnya Dahulu');
      mustValidatedOnVisited.documentLainnya = false;
    }

    if (landCertificate && landCertificate.length < MINIMUM_CERTIFICATE) {
      this._showNotification('error', 'Masukkan Certificate Dahulu');
      mustValidatedOnVisited.certificate = false;
    }

    if (
      this.collateralAppraisal.collateral.collateralTypeId === 'PROPERTY' ||
      this.collateralAppraisal.collateral.collateralTypeId === 'REALESTATE'
    ) {
      if (marketValue.land.length < 1 && marketValue.building.length < 1) {
        this._showNotification('error', 'Masukkan Market Value M2 di Valuation Dahulu');
        mustValidatedOnVisited.marketValueM2 = false;
      }
      if (this.collateralAppraisalService.totalDataValuationLand.length < MINIMUM_LAND_DETAIL) {
        this._showNotification('error', 'Masukkan Land Detail Dahulu');
        mustValidatedOnVisited.landDetail = false;
      }
      if (this.collateralAppraisalService.totalDataValuationBuilding.length < MINIMUM_BUILDING_DETAIL) {
        this._showNotification('error', 'Masukkan Building Detail Dahulu');
        mustValidatedOnVisited.building = false;
      }
    }

    if (this.collateralAppraisal.collateral.collateralTypeId === 'MACHINE') {
      if (!this.checkMachineMarketValue()) {
        this._showNotification('error', 'Masukkan Market Value di Valuation Dahulu');
        mustValidatedOnVisited.machineMarketValue = false;
      }
      if (!this.checkMachinePercentage()) {
        this._showNotification('error', 'Masukkan Percentage di Valuation Dahulu');
        mustValidatedOnVisited.precentage = false;
      }
    }

    if (
      this.collateralAppraisalService.totalDataComparison.length < MINIMUM_COMPARISON_DATA &&
      this.collateralAppraisal.collateral.collateralTypeId !== 'MACHINE'
    ) {
      this._showNotification('error', 'Comparison data less than 3');
      mustValidatedOnVisited.comparisonData = false;
    }

    if (this.collateralAppraisalService.totalDataFotoObjectJaminan.length < MINIMUM_OBJECT_JAMINAN_DATA) {
      this._showNotification('error', 'Foto object jaminan data less than 6');
      mustValidatedOnVisited.fotoObjectJaminan = false;
    }

    if (this.collateralAppraisal.attributes['marketbility'] === '') {
      this._showNotification('error', 'Masukkan Marketability Dahulu');
      mustValidatedOnVisited.marketability = false;
    }
    if (this.surveyAppraisal.apprOfficer === 'Internal') {
      if (!this.surveyAppraisal.thruDate) {
        this._showNotification('error', 'Memilih Tanggal Appraisal Validity Period Dahulu');
        mustValidatedOnVisited.appraisalValidity = false;
      }
    }
    return this._validateProcess(mustValidatedOnVisited);
  }

  public validateDraft(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnDraft() && resolve('Draft Validated');
    });
  }

  public validateAssignment(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnAssignment() && resolve('Assignment Validated');
    });
  }

  public validateApprovalTL(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnApprovalTL() && resolve('Assignment Validated');
    });
  }

  public validateAssigned(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnAssigned() && resolve('Assigned Validated');
    });
  }

  public validateVisited(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnVisited() && resolve('Visited Validated');
    });
  }

  public loadProperty(collateral: ICollateral): void {
    this.collateralPropertyService
      .queryFilterBy({
        idCollateral: collateral.id,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralProp = lodash.find(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.GENERAL && o.external === false;
        });
      });
  }

  public cekValuation() {
    this.saveCollateralProperty(this.collateralProp);
  }
  public marketValueLandRound: number;
  public saveCollateralProperty(property: ICollateralProperty) {
    if (this.collateralProp) {
      this.collateralPropertyService.save(property).subscribe(res => {});
    }
  }

  getText(parentPath: string): string {
    if (parentPath === 'collateral-appraisal') {
      return 'Request Appraisal';
    } else if (parentPath === 'batch-apprisal') {
      return 'Appraisal Distribution External';
    } else {
      return 'Appraisal Result Inqury';
    }
  }

  public showTextMenu(): void {
    if (this.subMenu.length > 1) {
      let menuList = [];
      menuList = [...this.subMenu];
      for (let i = 0; i < menuList.length; i++) {
        if (this.clickedMenu === menuList[i].id) {
          return menuList[i].label;
        } else {
          for (let y = 0; y < menuList[i].child?.length; y++) {
            if (this.clickedMenu === menuList[i].child[y].id) {
              return menuList[i].child[y].label;
            }
          }
        }
      }
    }
  }

  // menu request appraisal
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

  // setValuation in Attributes
  getValuationMVLV(): void {
    this.collateralPropertyService.getValuationAndProperties(this.collateral, this.surveyAppraisal.id).subscribe(
      (result: any[]) => {
        this.valuationData = result;
      },
      error => {
        console.error('Error fetching valuations:', error);
      }
    );
  }

  public saveMVLV(copySurveyAppraisal: ISurveyAppraisals) {
    let totalMarketValue = 0;
    let totalMarketValueIMB = 0;
    let totalMarketValueTataKota = 0;
    let totalLiquidationValue = 0;
    let totalLiquidationValueIMB = 0;
    let totalLiquidationValueTataKota = 0;

    // Cek apakah valuationData ada dan iterasi untuk mengakumulasi nilai
    if (this.valuationData && this.valuationData.length > 0) {
      this.valuationData.forEach(item => {
        if (item.marketValue) {
          totalMarketValue += item.marketValue;
        }
        if (item.marketValueIMB) {
          totalMarketValueIMB += item.marketValueIMB;
        }
        if (item.totalMarketValueTataKota) {
          totalMarketValueTataKota += item.marketValueTataKota;
        }
        if (item.liquidationValue) {
          totalLiquidationValue += item.liquidationValue;
        }
        if (item.liquidationValueIMB) {
          totalLiquidationValueIMB += item.liquidationValueIMB;
        }
        if (item.liquidationValueTataKota) {
          totalLiquidationValueTataKota += item.liquidationValueTataKota;
        }
      });
      copySurveyAppraisal.attributes['valuation'] = JSON.stringify(this.valuationData);
      // Simpan total ke dalam surveyAppraisal
      copySurveyAppraisal.totalMarketValue = totalMarketValue;
      copySurveyAppraisal.totalMarketValueIMB = totalMarketValueIMB;
      copySurveyAppraisal.totalMarketValueTataKota = totalMarketValueTataKota;
      copySurveyAppraisal.totalLiquidationValue = totalLiquidationValue;
      copySurveyAppraisal.totalLiquidationValueIMB = totalLiquidationValueIMB;
      copySurveyAppraisal.totalLiquidationValueTataKota = totalLiquidationValueTataKota;
    }
  }
}
