/* eslint-disable @typescript-eslint/no-misused-promises */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import {
  MINIMUM_BUILDING_DETAIL,
  MINIMUM_CERTIFICATE,
  MINIMUM_COMPARISON_DATA,
  MINIMUM_DOCUMENT_COLLATERAL,
  MINIMUM_DOCUMENT_LAINYA,
  MINIMUM_LAND_DETAIL,
  MINIMUM_MACHINE_DETAIL,
  MINIMUM_OBJECT_JAMINAN_DATA,
  MINIMUM_VEHCICLE_DETAIL,
} from 'app/shared/constants/config.constants';
import { STATUS } from 'app/shared/constants/status.constants';
import {
  COLLATERAL_TYPE,
  SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL,
  SUBMENU_COLLATERAL_APPRAISAL_REALESTATE,
} from 'app/shared/constants/base.constants';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { MessageService } from 'primeng/api';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { CollateralAppraisalProcessService } from '../collateral-appraisal/collateral-appraisal-process.service';
import { CollateralAppraisal, ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { Collateral, ICollateral } from '../collateral/collateral.model';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { PartyPostalAddressService } from '../party-postal-address/party-postal-address.service';
import { IPostalAddress } from '../postal-address/postal-address.model';
import { StorageService } from '../storage/storage.service';
import { ISurveyAppraisals, SurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import lodash from 'lodash';
import { AccountService } from 'app/core/auth/account.service';
import { PARTY_TYPE, SUBMENU_COLLATERAL_APPRAISAL, SUBMENU_COLLATERAL_APPRAISAL_ADMIN } from 'app/shared/constants/base.constants';
import { Authority } from 'app/config/authority.constants';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { IPartyPostalAddress } from '../party-postal-address/party-postal-address.model';
import { Cif, ICif } from '../cif/cif.model';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { IScoreCard, ScoreCard } from '../collateral-appraisal/negative/score-card.constant';
import { CollateralAppraisalProcessComponent } from '../collateral-appraisal/foto/collateral-appraisal-process.component';
import { CollateralAppraisalComparisonComponent } from '../collateral-appraisal/comparison/collateral-appraisal-comparison.component';
import { CollateralAppraisalForwardToComponent } from '../collateral-appraisal/summary/forward-to/collateral-appraisal-forward-to.component';
import { CollateralAppraisalDetailProcessLandCertificatesComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-land-certificates.component';
import { DocumentComponent } from '../document/document.component';
import { CollateralAppraisalDetailProcessLandComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-land.component';
import { CollateralAppraisalDetailProcessUnitConditionComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-unit-condition.component';
import { CollateralAppraisalDetailProcessMesinComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-mesin.component';
import { CollateralAppraisalSummaryComponent } from '../collateral-appraisal/summary/collateral-appraisal-summary.component';
import { CollateralAppraisalDetailProcessRealEstateComponent } from '../collateral-appraisal/collateral/collateral-appraisal-process-detail-real-estate.component';
import { TemplateService } from 'app/layouts/template/template.service';
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
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalValuationPropertyComponent,
  ],
  selector: 'jhi-survey-batch-edit-internal',
  templateUrl: './survey-batch-edit-internal.component.html',
  styleUrls: ['./survey-batch-edit.css'],
})
export class SurveyBatchEditInternalComponent implements OnInit {
  @ViewChild('collateralAppraisalSummaryComponent', {
    static: false,
  })
  collateralAppraisalSummaryComponent: CollateralAppraisalSummaryComponent;
  public wilayahKotaExternalValue?: string;
  public teamReviewerValue: string;
  public kjppIndependentAppraisalValue?: string;
  public clickedMenu: string;
  public approveDate: string;
  public visitedDate: string;
  public checkedData: boolean;
  public timeLineStatus: any[];
  public cif?: ICif = new Cif();
  private resProcess: any;
  private taskProcess: IProcessTask;
  public menuItems: MenuItemModel[] = [];
  public collateral: ICollateral = new Collateral();
  public partyType: string;
  public collateralType: string;
  public totalDataDetailLand = [];
  public tipeOfficerAppraisal?: string;
  public menuItemsMin: MenuItemModel[] = [
    {
      text: 'Appraisal Info',
    },
    {
      text: 'Customer Info',
    },
    {
      text: 'Collateral Info',
    },
  ];

  private _collateralAppraisal: ICollateralAppraisal;
  appraisalValidity: any;
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
  public collateralProp: ICollateralProperty;
  private id: number;
  public tasks: IProcessTask[] = new Array<IProcessTask>();
  private currentAccount: Account;
  public accountAuthorities?: Object[];
  public postalAddress: IPostalAddress;

  public creditProposal: ICreditProposal;
  public subMenu: object[];
  public collateralProperties: ICollateralProperty[];
  public bucket: string;
  public fotoObjectJaminan: any;
  public keteranganObjectJaminan: any;
  public ketObjekJaminan: Boolean;
  public totalDataDocumentCollateral = [];
  public totalDataDocumentLainya = [];
  public positionTypeId: string;
  public isOpen = false;
  public jpRenewal: boolean;
  public jpNew: boolean;
  public jpAdditional: boolean;
  public jpProgress: boolean;
  public jpOther: boolean;
  public selectedMenu: string;
  public menuItemsAll: MenuItemModel[] = [
    {
      text: 'Appraisal Info',
    },
    {
      text: 'Customer Info',
    },
    {
      text: 'Collateral Info',
    },
    {
      text: 'Valuation',
    },
    {
      text: 'Comparison Data',
    },
    {
      text: 'Foto Objek Jaminan',
    },
    {
      text: 'Summary',
    },
  ];
  public collateralAppraisalMainRolesAccess = [
    {
      role: Authority.ADMIN,
      isAuthorized: false,
    },
    {
      role: Authority.RM,
      isAuthorized: false,
    },
    {
      role: Authority.ADMIN_APPRAISER,
      isAuthorized: false,
    },
    {
      role: Authority.SURVEYOR,
      isAuthorized: false,
    },
  ];

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
    public collateralAppraisalDetailProcessRealEstateComponent: CollateralAppraisalDetailProcessRealEstateComponent,
    public collateralAppraisalValuationPropertyComponent: CollateralAppraisalValuationPropertyComponent,
    public templateService: TemplateService
  ) {
    this.collateralAppraisal = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.clickedMenu = subRoute;
      } else {
        this.clickedMenu = 'appraisal-info';
      }
    });
  }

  ngOnInit(): void {
    this.loadCollateralAppraisal(this.id).then(res => {
      this.initialize();
    });
    this.getPositionTypeId();
  }

  private getPositionTypeId(): void {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.positionTypeId = newPos.positionTypeId;
    });
  }

  public ceckData(menu: object) {
    const router = this.router.url.split('=')[1];
    if (router !== menu['id']) {
      this.messageService.add({
        severity: 'info',
        summary: 'Warning',
        detail: 'Dont forget to save data on this page',
      });
      this.router.navigate(['/batch-apprisal', this.id, 'edit-internal'], {
        queryParams: {
          subroute: menu['id'],
        },
      });
    }
  }

  public routeSubMenu(menu: object): void {
    this.ceckData(menu);
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

  public collateralAppraisalFunc(item: ICollateralAppraisal) {
    this.loadData(item.collateral);
    this.documentLainnya(item.id);

    this.collateralAppraisalProcessComponent.getFilesByKey(`/appraisals/${item.id}/jaminan`);
    this.collateralAppraisalDetailProcessLandComponent.propertyData(item.collateralId, CollateralPropertyType.LAND);
    this.collateralAppraisalDetailProcessRealEstateComponent.propertyDataBuilding(item.collateralId, CollateralPropertyType.BUILDING);
    this.getKeteranganObjectJaminan();

    if (item.collateral.propertyUsage !== '') {
      this.checkedData = true;
    }
  }
  private ngUnsubscribe = new Subject();
  public totalKeteranganObjectJaminan;
  // create function to read content of Blob file and return as string
  private async readFile(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(JSON.parse(reader.result as string));
      };
      reader.onerror = error => reject(error);

      reader.readAsText(file);
    });
  }

  // get keterangan objek jaminan
  private getKeteranganObjectJaminan(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'appraisals/remark/keterangan-objek-jaminan/' + paramsId + '/sfdt',
    };
    // eslint-disable-next-line @typescript-eslint/require-await
    this.storageService.getBucketName().subscribe(async bucket => {
      this.storageService
        .getObjects(bucket.body['bucket'], obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(async response => {
          // return new file from response
          const document_file = await firstValueFrom(this.storageService.fileBlob(response.body[0]['url']));
          // return content of file as string
          this.totalKeteranganObjectJaminan = await this.readFile(document_file.body);
          // return this.totalKeteranganObjectJaminan = array of block in section;
          this.totalKeteranganObjectJaminan = await this.totalKeteranganObjectJaminan.sections[0].blocks;

          const arr = [];
          this.totalKeteranganObjectJaminan.forEach(el => {
            if (el.inlines) {
              el.inlines.forEach(inline => {
                if (inline.text) {
                  arr.push(inline.text);
                }
              });
            }
          });

          this.totalKeteranganObjectJaminan = arr;
        });
    });
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  public surveyAppraisalFunc(item: ISurveyAppraisals) {
    if (item !== undefined) {
      // Get Foto Object Jaminan
      this.loadData(item.collateral);
      this.collateralData(item.collateral.id);
      this.collateralAppraisalProcessComponent.getFilesByKey(`/appraisals/${item.id}/jaminan`);

      this.getFotoObjectJaminan();
      this.documentCollateralComponent.getCollateralPropertyByCollateralId(item.collateralId);
      this.collateralAppraisalDetailProcessLandComponent.propertyData(item.collateralId, CollateralPropertyType.LAND);
      this.collateralAppraisalDetailProcessRealEstateComponent.propertyDataBuilding(item.collateralId, CollateralPropertyType.BUILDING);

      this.collateralAppraisalDetailProcessUnitConditionComponent.getCollateralPropertyByCollateralId(item.collateralId);
      this.collateralAppraisalDetailProcessMesinComponent.collateralProperties(item.collateralId);
    }
  }

  public getFotoObjectJaminan() {
    const arr = [];
    this.storageService.getBucketName().subscribe(res => {
      this.storageService
        .getObjects(res.body['bucket'], {
          key: `/appraisals/${this.collateralAppraisal.id}/jaminan`,
        })
        .subscribe((result: any) => {
          result.body.forEach(e => {
            arr.push(e['tags']['category']);
          });
          this.collateralAppraisalService.totalDataFotoObjectJaminan = arr.filter(item => item === 'OBJECT');
        });
    });
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
      });
  }
  public collateralData(id: number) {
    this.storageService.getBucketName().subscribe((r: any) => {
      const predicate: Object = {
        key: `/collateral/${id}/document`,
      };
      this.storageService.getObjects(r.body.bucket, predicate).subscribe((res: any) => {
        this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
        this.totalDataDocumentCollateral = res.body;
      });
    });
  }

  public documentLainnya(id: number) {
    this.storageService.getBucketName().subscribe((r: any) => {
      const predicate: Object = {
        key: `/appraisals/${id}/document-lainnya`,
      };
      this.storageService.getObjects(r.body.bucket, predicate).subscribe((res: any) => {
        this.collateralAppraisalService.totalDataDocumentLainya = res.body;
        this.totalDataDocumentLainya = res.body;
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
  public setAppraisalValidity(ev) {
    this.appraisalValidity = ev;
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
        if (this.collateralAppraisal.attributes['marketbility'] !== '' && this.totalKeteranganObjectJaminan.length >= 0) {
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
          this.totalDataDocumentCollateral.length >= MINIMUM_DOCUMENT_COLLATERAL &&
          this.totalDataDocumentLainya.length >= MINIMUM_DOCUMENT_LAINYA
        ) {
          if (
            this.collateralAppraisal.collateral.collateralTypeId === 'PROPERTY' ||
            this.collateralAppraisal.collateral.collateralTypeId === 'REALESTATE'
          ) {
            if (
              this.collateralAppraisalService.totalDataDetailLand.length >= MINIMUM_LAND_DETAIL ||
              this.totalDataDetailLand.length >= MINIMUM_LAND_DETAIL
            ) {
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
    }
    return false;
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

  private async initialize(): Promise<void> {
    this.loadData(this.collateralAppraisal.collateral);
    this.bucket = this.getBucketName()['bucket'];
    this.collateralAppraisalProcessComponent.getFilesByKey(`/appraisals/${this.collateralAppraisal.id}/jaminan`);

    this.getKeteranganObjectJaminan();

    const key = `/appraisals/${this.collateralAppraisal.id}/jaminan`;
    this.collateralAppraisalService.totalDataFotoObjectJaminan = await this.getDocument(key);

    if (this.collateralAppraisal.collateralId) {
      this.collateralAppraisalService.totalDataComparison = await this.getCollateralProperty(
        this.collateralAppraisal.collateralId,
        CollateralPropertyType.COMPARISON
      );
    }

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
    if (
      this.positionTypeId === 'TL' ||
      this.positionTypeId === 'APR_DEPT_HEAD' ||
      this.positionTypeId === 'APR_DH' ||
      this.positionTypeId === 'ADMIN_APPRAISER'
    ) {
      this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_ADMIN;
    } else {
      this.subMenu = SUBMENU_COLLATERAL_APPRAISAL;
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

  public timeLine() {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('APPRAISAL', this.id).subscribe(res => {
      this.timeLineStatus = res.body;
    });
  }

  private getTasks(): void {
    this.collateralAppraisalProcessService.getTasks(this.id).subscribe(res => {
      this.tasks = res.body;
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

  private getMenuAppraisalOfficer(ev: any): void {
    if (ev === 'external') {
      this.menuItems = [
        {
          text: 'Appraisal Info',
        },
        {
          text: 'Customer Info',
        },
        {
          text: 'Collateral Info',
        },
        {
          text: 'External Officer Info',
        },
      ];
    } else {
      if (this.collateralType === 'PROPERTY' || this.collateralType === 'REALESTATE') {
        this.menuItems = [
          {
            text: 'Appraisal Info',
          },
          {
            text: 'Customer Info',
          },
          {
            text: 'Collateral Info',
          },
          {
            text: 'Valuation',
          },
          {
            text: 'Negative Collateral',
          },
          {
            text: 'Comparison Data',
          },
          {
            text: 'Foto Objek Jaminan',
          },
          {
            text: 'Summary',
          },
        ];
      } else {
        this.menuItems = [
          {
            text: 'Appraisal Info',
          },
          {
            text: 'Customer Info',
          },
          {
            text: 'Collateral Info',
          },
          {
            text: 'Valuation',
          },
          {
            text: 'Comparison Data',
          },
          {
            text: 'Foto Objek Jaminan',
          },
          {
            text: 'Summary',
          },
        ];
      }
    }
  }

  private getCustomerInfo(): void {
    this.partyType = this.collateralAppraisal.partyTypeId === PARTY_TYPE.PERSON ? 'Individual' : 'Corporate';
    this.surveyAppraisalsService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(res => {
      this.cif = res.body['cif'] !== null ? res.body['cif'] : new Cif();
      this.getConditionSubMenu(res.body);
    });
  }

  public getConditionSubMenu(data): void {
    if (data.apprOfficer === 'External') {
      this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_EXTERNAL;
    }
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

  private parseCollateralAppraisal(data: ICollateralAppraisal): ICollateralAppraisal {
    if (!lodash.has(data.attributes, 'marketbility')) {
      data.attributes['marketbility'] = '';
    }
    if (data.attributes === undefined || data.attributes === null) {
      data.attributes['scoreCard'] = new ScoreCard();
    } else {
      if (!Object.prototype.hasOwnProperty.call(data.attributes, 'scoreCard')) {
        data.attributes['scoreCard'] = new ScoreCard();
      } else if (typeof data.attributes['scoreCard'] === 'string') {
        const scoreCardString = data.attributes['scoreCard'].trim();
        if (scoreCardString === '' || scoreCardString === 'null' || scoreCardString === 'undefined') {
          data.attributes['scoreCard'] = new ScoreCard();
        } else {
          try {
            data.attributes['scoreCard'] = JSON.parse(scoreCardString);
          } catch (error) {
            data.attributes['scoreCard'] = new ScoreCard();
          }
        }
      }
    }
    return data;
  }

  private async loadCollateralAppraisal(id: number): Promise<void> {
    this.collateralAppraisal = this.parseCollateralAppraisal((await firstValueFrom(this.collateralAppraisalService.find(id))).body);
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

  public onAssignTo(ev) {
    this.surveyAppraisal = ev;
  }

  public onSave(source: string): void {
    this.ketObjekJaminan = true;
    if (source === 'process') {
      // validate
      this.validateAppraisal().then(() => this.mainSave(source));
    } else {
      this.mainSave(source);
    }
  }

  public checkMustValidatedOnDraft() {
    const mustValidateOnDraft = {
      jenisObject: true,
      jenisPermohonan: true,
      documentCollateral: true,
      documentLainnya: true,
      picDebtor: true,
      picPhone: true,
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
    if (this.collateralAppraisalService.totalDataDocumentCollateral.length < MINIMUM_DOCUMENT_COLLATERAL) {
      if (this.totalDataDocumentCollateral.length < MINIMUM_DOCUMENT_COLLATERAL) {
        this._showNotification('error', 'Masukkan Document Collateral Dahulu');
        mustValidateOnDraft.documentLainnya = false;
      }
    }

    if (this.collateralAppraisalService.totalDataDocumentLainya.length < MINIMUM_DOCUMENT_LAINYA) {
      if (this.totalDataDocumentLainya.length < MINIMUM_DOCUMENT_LAINYA) {
        this._showNotification('error', 'Masukkan Document Lainnya Dahulu');
        mustValidateOnDraft.documentLainnya = false;
      }
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
  public validateApprovalTL(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidatedOnApprovalTL() && resolve('Assignment Validated');
    });
  }

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
      if (this.totalDataDocumentCollateral.length < MINIMUM_DOCUMENT_COLLATERAL) {
        this._showNotification('error', 'Masukkan Document Collateral Dahulu');
        mustValidatedOnVisited.documentCollateral = false;
      }
    }

    if (this.collateralAppraisalService.totalDataDocumentLainya.length < MINIMUM_DOCUMENT_LAINYA) {
      if (this.totalDataDocumentLainya.length < MINIMUM_DOCUMENT_LAINYA) {
        this._showNotification('error', 'Masukkan Document Lainnya Dahulu');
        mustValidatedOnVisited.documentLainnya = false;
      }
    }
    if (
      this.collateralAppraisal.collateral.collateralTypeId === 'PROPERTY' ||
      this.collateralAppraisal.collateral.collateralTypeId === 'REALESTATE'
    ) {
      if (marketValue.land.length < 1 && marketValue.building.length < 1) {
        this._showNotification('error', 'Masukkan Market Value M2 di Valuation Dahulu');
        mustValidatedOnVisited.marketValueM2 = false;
      }
      if (this.collateralAppraisalService.totalDataDetailLand.length < MINIMUM_LAND_DETAIL) {
        this._showNotification('error', 'Masukkan Land Detail Dahulu');
        mustValidatedOnVisited.landDetail = false;
      }
      if (this.collateralAppraisalService.totalDataDetailBuilding.length < MINIMUM_BUILDING_DETAIL) {
        this._showNotification('error', 'Masukkan Building Detail Dahulu');
        mustValidatedOnVisited.building = false;
      }
      if (this.surveyAppraisal.collateral.attributes['landCertificates'] === '') {
        this._showNotification('error', 'Masukkan Certificate Dahulu');
        mustValidatedOnVisited.certificate = false;
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

  private saveProcess(): void {
    this.collateralAppraisalProcessService.processTask(this.resProcess).subscribe(res => {
      this.router.navigate(['./batch-apprisal/internal']);
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
        copySurveyAppraisal.collateral.attributes['landCertificates']
      );
    } else {
      copySurveyAppraisal.collateral.attributes['landCertificates'];
    }
    return copySurveyAppraisal;
  }

  private mainSave(source: string): void {
    const copySurveyAppraisal: ISurveyAppraisals = this.preSave();

    if (copySurveyAppraisal.id) {
      this.surveyAppraisalsService.update(copySurveyAppraisal).subscribe(res => {
        this.getTasks();
        if (source === 'process') {
          this.saveProcess();
          if (this.collateralAppraisalSummaryComponent) {
            this.collateralAppraisalSummaryComponent.triggeredSave();
            this.getKeteranganObjectJaminan();
          }
        } else if (source === 'default') {
          if (this.collateralAppraisalSummaryComponent) {
            this.collateralAppraisalSummaryComponent.triggeredSave();
            this.getKeteranganObjectJaminan();
          }
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
          if (this.collateralAppraisalSummaryComponent) {
            this.collateralAppraisalSummaryComponent.triggeredSave();
            this.getKeteranganObjectJaminan();
          }
        } else if (source === 'default') {
          if (this.collateralAppraisalSummaryComponent) {
            this.collateralAppraisalSummaryComponent.triggeredSave();
            this.getKeteranganObjectJaminan();
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
        }
      });
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

  previousState(): void {
    window.history.back();
  }
  public triggerToggle() {
    this.isOpen = !this.isOpen;
  }

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
