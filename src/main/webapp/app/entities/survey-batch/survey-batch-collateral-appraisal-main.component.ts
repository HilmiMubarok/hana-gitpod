import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { IPerson, Person } from '../person/person.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { ICollateral, Collateral } from '../collateral/collateral.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { CollateralAppraisalProcessService } from '../collateral-appraisal/collateral-appraisal-process.service';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { FieldSettingsModel } from '@syncfusion/ej2-angular-navigations';

import { IProcessTask } from 'app/shared/model/process-task.model';
import { IScoreCard, ScoreCard } from '../collateral-appraisal/negative/score-card.constant';

import { ICif, Cif } from '../cif/cif.model';
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import { ISurveyAppraisals, SurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';
import { PartyPostalAddressService } from '../party-postal-address/party-postal-address.service';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';
import lodash from 'lodash';
import { IPartyPostalAddress } from '../party-postal-address/party-postal-address.model';

import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';
import {
  COLLATERAL_TYPE,
  SUBMENU_COLLATERAL_APPRAISAL,
  SUBMENU_COLLATERAL_APPRAISAL_ADMIN,
  SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL,
  SUBMENU_SURVEY_BATCH_COLLATERAL_APPRAISAL,
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
} from 'app/shared/constants/config.constants';
import { Authority } from 'app/config/authority.constants';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { StorageService } from '../storage/storage.service';
import { STATUS } from 'app/shared/constants/status.constants';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { CollateralAppraisalDetailProcessMesinComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-mesin.component';
import { CollateralAppraisalForwardToComponent } from '../collateral-appraisal/summary/forward-to/collateral-appraisal-forward-to.component';
import { DocumentComponent } from '../document/document.component';
import { CollateralAppraisalDetailProcessLandCertificatesComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-land-certificates.component';
import { CollateralAppraisalComparisonComponent } from '../collateral-appraisal/comparison/collateral-appraisal-comparison.component';
import { CollateralAppraisalDetailProcessLandComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-land.component';
import { CollateralAppraisalDetailProcessUnitConditionComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-unit-condition.component';
import { CollateralAppraisalProcessComponent } from '../collateral-appraisal/foto/collateral-appraisal-process.component';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { CollateralAppraisalValuationPropertyComponent } from '../collateral-appraisal/valuation/details/collateral-appraisal-valuation-property.component';

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
  selector: 'jhi-survey-batch-collateral-appraisal-main',
  templateUrl: './survey-batch-collateral-appraisal-main-floating.component.html',
  styleUrls: ['./survey-batch-collateral-appraisal-main.css'],
})
export class SurveyBatchCollateralAppraisalMainComponent implements OnInit {
  public clickedMenu: string;

  private _collateralAppraisal: ICollateralAppraisal;
  get collateralAppraisal() {
    return this._collateralAppraisal;
  }

  set collateralAppraisal(item: ICollateralAppraisal) {
    if (item !== undefined) {
      this.collateralAppraisalFunc(item);
      this._collateralAppraisal = item;
    }
  }

  private _surveyAppraisal: ISurveyAppraisals;
  get surveyAppraisal() {
    return this._surveyAppraisal;
  }

  set surveyAppraisal(item: ISurveyAppraisals) {
    if (item !== undefined) {
      this.surveyAppraisalFunc(item);
      this._surveyAppraisal = item;
    }
  }

  private id: number;
  private idParent: number;
  public tasks: IProcessTask[] = new Array<IProcessTask>();
  private currentAccount: Account;
  public accountAuthorities?: Object[];
  public postalAddress: IPostalAddress;

  public creditProposal: ICreditProposal;
  public subMenu: object[];
  public collateralProperties: ICollateralProperty[];
  public bucket: string;
  public fotoObjectJaminan: any;
  private resProcess: any;
  private taskProcess: IProcessTask;
  public wilayahKotaExternalValue?: string;
  public teamReviewerValue: string;
  public kjppIndependentAppraisalValue?: string;
  public jpRenewal: boolean;
  public jpNew: boolean;
  public jpAdditional: boolean;
  public jpProgress: boolean;
  public jpOther: boolean;
  public timeLineStatus: any[];
  public totalDataDocumentCollateral = [];
  public totalDataDocumentLainya = [];
  public totalDataDetailLand = [];
  public checkedData: boolean;
  public title: string;
  public titleMenu: string;
  public titleUrl: any;
  appName: any;
  appNameMenu: any;
  public parentPath = this.router.url.split('/')[1];
  public value: string;
  public isOpen = false;
  public collateralProp: ICollateralProperty;

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
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.idParent = params['idParent'];
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

  ngOnInit(): void {
    this.loadCollateralAppraisal(this.id).then(res => {
      this.initialize();
    });
  }

  private parseCollateralAppraisal(data: ICollateralAppraisal): ICollateralAppraisal {
    if (!lodash.has(data.attributes, 'marketbility')) {
      data.attributes['marketbility'] = '';
    }
    if (data.attributes === undefined || data.attributes === null || typeof data.attributes['scoreCard'] === 'string') {
      data.attributes['scoreCard'] = JSON.parse(data.attributes['scoreCard']);
    } else {
      if (!Object.prototype.hasOwnProperty.call(data.attributes, 'scoreCard')) {
        data.attributes['scoreCard'] = new ScoreCard();
      } else {
        data.attributes['scoreCard'] = JSON.parse(data.attributes['scoreCard']);
      }
    }
    return data;
  }
  private async loadCollateralAppraisal(id: number): Promise<void> {
    this.collateralAppraisal = this.parseCollateralAppraisal((await firstValueFrom(this.collateralAppraisalService.find(id))).body);
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
  private async getCollateralProperty(_idCollateral: number, _idPropertyType: string): Promise<ICollateralProperty[]> {
    return (
      await firstValueFrom(
        this.collateralPropertyService.queryFilterBy({
          page: 0,
          size: 9999,
          idCollateral: _idCollateral,
          idPropertyType: _idPropertyType,
        })
      )
    ).body;
  }

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
        this.collateralProp = lodash.find(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.GENERAL && o.external === true;
        });
      });
  }

  public documentCollateral(id: number) {
    this.storageService.getBucketName().subscribe((r: any) => {
      const predicate: Object = {
        key: `/appraisals/${id}/document-colateral`,
      };

      this.storageService.getObjects(r.body.bucket, predicate).subscribe((res: any) => {
        this.totalDataDocumentCollateral = res.body;
      });
    });
  }

  public propertyData(_collateralId: number, data: string) {
    this.collateralPropertyService
      .queryFilterBy({
        page: 0,
        size: 10,
        sort: ['asc'],
        idCollateral: _collateralId,
        idPropertyType: data,
      })
      .subscribe((res: any) => {
        this.totalDataDetailLand = res.body;
        this.collateralAppraisalService.totalDataDetailLand = res.body;
      });
  }

  public collateralData(id: number) {
    this.storageService.getBucketName().subscribe((r: any) => {
      const predicate: Object = {
        key: `/collateral/${id}/document`,
      };
      this.storageService.getObjects(r.body.bucket, predicate).subscribe((res: any) => {
        this.totalDataDocumentCollateral = res.body;
      });
    });
  }
  private async getBucketName(): Promise<object> {
    return (await firstValueFrom(this.storageService.getBucketName())).body;
  }

  private async getDocument(_key: string): Promise<Object[]> {
    const predicate: Object = {
      key: _key,
    };
    return (await firstValueFrom(this.storageService.getObjects(this.bucket, predicate))).body;
  }

  public documentLainnya(id: number) {
    this.storageService.getBucketName().subscribe((r: any) => {
      const predicate: Object = {
        key: `/appraisals/${id}/document-lainnya`,
      };
      this.storageService.getObjects(r.body.bucket, predicate).subscribe((res: any) => {
        this.totalDataDocumentLainya = res.body;
      });
    });
  }
  public collateralAppraisalFunc(item: ICollateralAppraisal) {
    this.loadData(item.collateral);
    this.documentLainnya(item.id);

    this.collateralAppraisalProcessComponent.getFilesByKey(`/appraisals/${item.id}/jaminan`);

    if (item.collateral.propertyUsage !== '') {
      this.checkedData = true;
    }
  }

  public surveyAppraisalFunc(item: ISurveyAppraisals) {
    if (item !== undefined) {
      // Get Foto Object Jaminan
      this.collateralData(item.collateral.id);
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
  }
  private async initialize(): Promise<void> {
    this.bucket = this.getBucketName()['bucket'];

    let key: string;
    key = `/collateral/${this.collateralAppraisal.collateralId}/document`;

    this.collateralAppraisalService.totalDataDocumentCollateral = await this.getDocument(key);

    key = `/appraisals/${this.collateralAppraisal.id}/jaminan`;
    this.collateralAppraisalService.totalDataFotoObjectJaminan = await this.getDocument(key);

    if (this.collateralAppraisal.collateralId) {
      this.collateralAppraisalService.totalDataComparison = await this.getCollateralProperty(
        this.collateralAppraisal.collateralId,
        CollateralPropertyType.COMPARISON
      );
    }

    key = `/appraisals/${this.collateralAppraisal.id}/document-lainnya`;
    this.collateralAppraisalService.totalDataDocumentLainya = await this.getDocument(key);

    key = `/appraisals/${this.collateralAppraisal.id}/document-colateral`;
    this.collateralAppraisalService.totalDataDocumentCollateral = await this.getDocument(key);

    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['realestate']) {
      if (this.collateralAppraisal.collateralId) {
        this.collateralAppraisalService.totalDataDetailLand = await this.getCollateralProperty(
          this.collateralAppraisal.collateralId,
          CollateralPropertyType.LAND
        );
      }
    }

    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
      if (this.collateralAppraisal.collateralId) {
        this.collateralAppraisalService.totalDataDetailVehicle = await this.getCollateralProperty(
          this.collateralAppraisal.collateralId,
          CollateralPropertyType.VEHICLE
        );
      }
    }

    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
      if (this.collateralAppraisal.collateralId) {
        this.collateralAppraisalService.totalDataDetailMachine = await this.getCollateralProperty(
          this.collateralAppraisal.collateralId,
          CollateralPropertyType.MACHINE
        );
      }
    }

    this.currentAccount = await firstValueFrom(this.accountService.identity());
    this.accountAuthorities = this.currentAccount.authorities;
    if (lodash.indexOf(this.accountAuthorities, Authority.ADMIN) >= 0) {
      this.subMenu = SUBMENU_COLLATERAL_APPRAISAL;
    } else {
      if (
        lodash.indexOf(this.accountAuthorities, Authority.ADMIN_APPRAISER) >= 0 ||
        lodash.indexOf(this.accountAuthorities, Authority.RM) >= 0
      ) {
        if (
          this.collateralAppraisal.statusId === STATUS.DRAFT ||
          this.collateralAppraisal.statusId === STATUS.RETURNTORM ||
          this.collateralAppraisal.statusId === STATUS.ASSIGNMENT ||
          this.collateralAppraisal.statusId === STATUS.VISITED
        ) {
          this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_ADMIN;
        } else {
          this.subMenu = SUBMENU_COLLATERAL_APPRAISAL;
        }
        this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_ADMIN;
      } else {
        this.subMenu = SUBMENU_COLLATERAL_APPRAISAL;
      }
    }
    this.setAuthorizedRole();
    this.selectedMenu = 'Appraisal Info';
    this.setMenuByRole();
    this.getCustomerInfo();
    this.getDataSurveyAppraisal(this.id).then(res => {
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
      this.getValuationMVLV();
    });
    this.getTasks();
    this.timeLine();
  }

  private getDataSurveyAppraisal(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.find(this.id).subscribe(res => {
        this.surveyAppraisal = res.body;
        this.collateral = this.surveyAppraisal.collateral;
        this.collateralType = this.collateral.collateralTypeId;
        this.onValTipeOfficerAppraisalChanged(this.surveyAppraisal.apprOfficer);
        resolve();
      });
    });
  }

  private getCustomerInfo(): void {
    this.partyType = this._collateralAppraisal.partyTypeId === 'PERSON' ? 'Individual' : 'Corporate';
    this.surveyAppraisalsService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(res => {
      this.cif = res.body['cif'] !== null ? res.body['cif'] : new Cif();
      this.getConditionSubMenu(res.body);
    });
  }

  private getTasks(): void {
    this.collateralAppraisalProcessService.getTasks(this.id).subscribe(res => {
      this.tasks = res.body;
    });
  }

  public getConditionSubMenu(data): void {
    if (data.apprOfficer === 'External') {
      this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL;
    }
  }

  public getFilesByKey(_key: string): void {
    const obj: Object = { key: _key };
    this.storageService.getObjects(this.bucket, obj).subscribe((res: any) => {
      this.fotoObjectJaminan = res.body;
    });
  }

  private getCollateralPropertyByCollateralId(id: number): void {
    if (id) {
      this.collateralPropertyService.queryFilterBy({ idCollateral: id }).subscribe(res => {
        this.collateralProperties = res.body;
      });
    }
  }

  private getSurveyAppraisal(cifId: string): void {
    this.surveyAppraisalsService.find(cifId).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
      this.cif = res.body['cif'] !== null ? res.body['cif'] : new Cif();
    });
  }

  public addNewCriteria(data: IScoreCard[]): void {
    this.collateralAppraisal.attributes['scoreCard'] = data;
  }
  public processTask(task: IProcessTask): void {
    const dialogRef = this.dialog.open(TaskCommentDialogComponent, {
      width: '80vw',
      data: { processTask: task },
    });
    dialogRef.afterClosed().subscribe(_res => {
      if (_res) {
        this.resProcess = _res;
        this.taskProcess = task;
        if (_res.name === 'return' || _res.name === 'cancel') {
          this.saveProcess();
        } else {
          this.onSave('process');
        }
      }
    });
  }

  public setNew(ev: any) {
    this.jpNew = ev;
  }
  public setRenewal(ev: any) {
    this.jpRenewal = ev;
  }
  public setAdditional(ev: any) {
    this.jpAdditional = ev;
  }
  public setProgress(ev: any) {
    this.jpProgress = ev;
  }
  public setOther(ev: any) {
    this.jpOther = ev;
  }
  private saveProcess(): void {
    this.collateralAppraisalProcessService.processTask(this.resProcess).subscribe(res => {
      this.router.navigate(['./batch-apprisal/', this.idParent, 'edit']);
    });
  }
  private preSave(): ISurveyAppraisals {
    const copySurveyAppraisal = lodash.cloneDeep(this.surveyAppraisal);
    if (this.surveyAppraisal.apprOfficer === 'Internal') {
      copySurveyAppraisal.attributes['valuation'] = JSON.stringify(this.collateralAppraisalService.valuationData);

      let totalMarketValue = 0;
      let totalMarketValueIMB = 0;
      let totalMarketValueTataKota = 0;
      let totalLiquidationValue = 0;
      let totalLiquidationValueIMB = 0;
      let totalLiquidationValueTataKota = 0;

      if (this.collateralAppraisalService.valuationData && this.collateralAppraisalService.valuationData.length > 0) {
        this.collateralAppraisalService.valuationData.forEach(item => {
          if (item.marketValue) {
            totalMarketValue += item.marketValue;
          }
          if (item.marketValueIMB) {
            totalMarketValueIMB += item.marketValueIMB;
          }
          if (item.marketValueTataKota) {
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

        copySurveyAppraisal.totalMarketValue = this.collateralPropertyService.roundHundred(totalMarketValue);
        copySurveyAppraisal.totalMarketValueIMB = this.collateralPropertyService.roundHundred(totalMarketValueIMB);
        copySurveyAppraisal.totalMarketValueTataKota = this.collateralPropertyService.roundHundred(totalMarketValueTataKota);
        copySurveyAppraisal.totalLiquidationValue = this.collateralPropertyService.roundHundred(totalLiquidationValue);
        copySurveyAppraisal.totalLiquidationValueIMB = this.collateralPropertyService.roundHundred(totalLiquidationValueIMB);
        copySurveyAppraisal.totalLiquidationValueTataKota = this.collateralPropertyService.roundHundred(totalLiquidationValueTataKota);
      }
    }
    copySurveyAppraisal.attributes['scoreCard'] = JSON.stringify(this.collateralAppraisal.attributes['scoreCard']);

    if (typeof copySurveyAppraisal.attributes['marketbility'] === 'object') {
      copySurveyAppraisal.attributes['marketbility'] = JSON.stringify(this.collateralAppraisal.attributes['marketbility']);
    } else {
      copySurveyAppraisal.attributes['marketbility'] = this.collateralAppraisal.attributes['marketbility'];
    }
    if (typeof copySurveyAppraisal.collateral.attributes['landCertificates'] === 'object') {
      copySurveyAppraisal.collateral.attributes['landCertificates'] = JSON.stringify(
        this.collateralAppraisal.attributes['landCertificates']
      );
    } else {
      copySurveyAppraisal.collateral.attributes['landCertificates'];
    }
    return copySurveyAppraisal;
  }

  public onSave(source: string): void {
    if (source === 'process') {
      // validate
      this.validateAppraisal().then(() => this.mainSave(source));
    } else {
      this.mainSave(source);
    }
  }

  public mainSave(source: string): void {
    const copySurveyAppraisal: ISurveyAppraisals = this.preSave();

    if (copySurveyAppraisal.id) {
      this.surveyAppraisalsService.update(copySurveyAppraisal).subscribe(res => {
        this.getTasks();

        if (source === 'process') {
          this.saveProcess();
        } else if (source === 'default') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
        }
      });
    } else {
      this.surveyAppraisalsService.create(copySurveyAppraisal).subscribe(res => {
        if (source === 'process') {
          this.saveProcess();
        } else if (source === 'default') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
        }
      });
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
    if (this.collateralAppraisal) {
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
        if (this.collateralAppraisal.attributes['marketbility'] !== '') {
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
      } else if (node.id === 'report-independent') {
        if (this.surveyAppraisal.totalMarketValue !== null || this.surveyAppraisal.totalLiquidationValue !== null) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  public ceckData(menu: object) {
    const router = this.router.url.split('=')[1];
    if (router !== menu['id']) {
      this.messageService.add({
        severity: 'info',
        summary: 'Warning',
        detail: 'Dont forget to save data on this page',
      });
      this.router.navigate(['/batch-apprisal', this.id, 'editNew', this.idParent], { queryParams: { subroute: menu['id'] } });
    }
  }

  public routeSubMenu(menu: object): void {
    this.ceckData(menu);
  }

  public checkMustValidatedOnAssignment() {
    const mustValidateOnAssignment = {
      wilayah: true,
      officerAppraisal: true,
      totalMarketValue: true,
      kjpp: true,
      teamLeadId: true,
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

    if (this.surveyAppraisal.apprOfficer === 'External') {
      if (!this.surveyAppraisal.surveyorArea) {
        this._showNotification('error', 'Masukkan Wilayah/Kota terlebih dahulu');
        mustValidateOnAssignment.wilayah = false;
      }
      if (!this.surveyAppraisal.teamLeadId) {
        this._showNotification('error', 'Masukkan Team Reviewer terlebih dahulu');
        mustValidateOnAssignment.teamLeadId = false;
      }
      if (!this.surveyAppraisal.surveyBatchId) {
        this._showNotification('error', 'Masukkan KJPP Independent Appraisal terlebih dahulu');
        mustValidateOnAssignment.kjpp = false;
      }
      // Matikan Dulu Sementara

      // if (!this.surveyAppraisal.totalMarketValue) {
      //   this._showNotification('error', 'Nominal Appraisal Value Physic tidak boleh kosong, Silahkan upload file terlebih dahulu !');
      //   mustValidateOnAssignment.totalMarketValue = false;
      // }
      // if (!this.surveyAppraisal.totalLiquidationValue) {
      //   this._showNotification('error', 'Nominal Liquidation Value tidak boleh kosong, Silahkan upload file terlebih dahulu !');
      //   mustValidateOnAssignment.totalMarketValue = false;
      // }
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
  public checkMustValidatedOnApprovalTL() {
    const mustValidateOnTL = {
      jenisObject: true,
      jenisPermohonan: true,
      documentCollateral: true,
      documentLainnya: true,
      picDebtor: true,
      picPhone: true,
      reviewedOpinion: true,
    };

    if (this.surveyAppraisal.apprOfficer === 'External') {
      if (!this.surveyAppraisal.reviewedOpinion) {
        this._showNotification('error', 'Masukkan Review Opinion terlebih dahulu');
        mustValidateOnTL.reviewedOpinion = false;
      }
    }

    return this._validateProcess(mustValidateOnTL);
  }
  private _showNotification(severity: string, message: string): void {
    // capitalize first letter for summary
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({
      severity,
      summary: severityCaptitalized,
      detail: message,
      life: 3000,
    });
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

  public validateAssignment(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnAssignment() && resolve('Assignment Validated');
    });
  }

  public validateAssigned(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnAssigned() && resolve('Assigned Validated');
    });
  }
  public validateApprovalTL(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnApprovalTL() && resolve('Approval Team Leader Validated');
    });
  }
  public validateAppraisal(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      switch (this.collateralAppraisal.statusId) {
        case STATUS.ASSIGNED:
          this.validateAssigned().then(() => resolve(true));
          break;
        case STATUS.ASSIGNMENT:
          this.validateAssignment().then(() => resolve(true));
          break;
        case STATUS.APPROVAL_TL:
          this.validateApprovalTL().then(() => resolve(true));
          break;
        default:
          resolve(true);
      }
    });
  }
  getTextMenu() {
    if (this.clickedMenu === 'batch-apprisal') {
      this.titleMenu = 'View Survey Batch';
    }
    if (this.clickedMenu === 'appraisal-info') {
      this.titleMenu = 'Appraisal Info';
    }
    if (this.clickedMenu === 'customer-info') {
      this.titleMenu = 'Customer Info';
    }
    if (this.clickedMenu === 'collateral-info') {
      this.titleMenu = 'Collateral Info';
    }
    if (this.clickedMenu === 'report-independent') {
      this.titleMenu = 'Report Independent';
    }
    return this.titleMenu;
  }

  getTitleUrl() {
    const x = this.router.url.split('/')[3].slice(0, 4).split('?');

    this.titleUrl = x;
  }
  // menu appraisal external/ KJPP View/ Edit
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
  private getValuationMVLV() {
    this.collateralPropertyService.getValuationAndProperties(this.collateral, this.surveyAppraisal.id).subscribe(
      (result: any[]) => {
        this.collateralAppraisalService.valuationData = result;
      },
      error => {
        console.error('Error fetching valuations:', error);
      }
    );
  }
}
