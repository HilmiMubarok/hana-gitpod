import { Component, OnInit } from '@angular/core';
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
import { IPartyPostalAddress } from '../party-postal-address/party-postal-address.model';

import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';
import {
  SUBMENU_COLLATERAL_APPRAISAL,
  SUBMENU_COLLATERAL_APPRAISAL_ADMIN,
  SUBMENU_COLLATERAL_APPRAISAL_MACHINE,
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
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { StorageService } from '../storage/storage.service';
import { STATUS } from 'app/shared/constants/status.constants';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'jhi-collateral-appraisal-main',
  templateUrl: './collateral-appraisal-main-floating.component.html',
  styleUrls: ['./collateral-appraisal-main.css'],
})
export class CollateralAppraisalMainComponent implements OnInit {
  public wilayahKotaExternalValue?: string;
  public teamReviewerValue: string;
  public kjppIndependentAppraisalValue?: string;
  public clickedMenu: string;
  public approveDate: string;
  public visitedDate: string;
  public timeLineStatus: any[];
  private _collateralAppraisal: ICollateralAppraisal;
  get collateralAppraisal() {
    return this._collateralAppraisal;
  }

  set collateralAppraisal(item: ICollateralAppraisal) {
    this._collateralAppraisal = item;
  }

  private _surveyAppraisal: ISurveyAppraisals;
  get surveyAppraisal() {
    return this._surveyAppraisal;
  }

  set surveyAppraisal(item: ISurveyAppraisals) {
    this._surveyAppraisal = item;
  }

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
    private _snackBar: MatSnackBar
  ) {
    this.postalAddress = new PostalAddress();
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
    { text: 'Foto Object Jaminan' },
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
    console.log('consoless', this.collateralAppraisal.statusId);
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
      this.accountAuthorities = account['authorities'];
      if (this.collateralAppraisal.collateral.collateralTypeId === 'MACHINE') {
        this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_MACHINE;
      } else {
        if (lodash.indexOf(this.accountAuthorities, 'ROLE_ADMIN') >= 0) {
          this.subMenu = SUBMENU_COLLATERAL_APPRAISAL;
        } else {
          if (
            lodash.indexOf(this.accountAuthorities, 'ROLE_ADMIN_APPRAISER') >= 0 ||
            lodash.indexOf(this.accountAuthorities, 'ROLE_RM') >= 0
          ) {
            if (this.collateralAppraisal.statusId === 'APPROVE') {
              this.subMenu = SUBMENU_COLLATERAL_APPRAISAL;
            } else {
              this.subMenu = SUBMENU_COLLATERAL_APPRAISAL_ADMIN;
            }
          } else {
            this.subMenu = SUBMENU_COLLATERAL_APPRAISAL;
          }
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
        const partyPostalAddress: IPartyPostalAddress = lodash.find(res.body, function (o) {
          return o.purposeTypeId === 'PRIMARY_LOCATION';
        });
        if (partyPostalAddress) {
          this.postalAddress = partyPostalAddress.address;
        }
      }
    });
  }

  private getDataSurveyAppraisal(): Promise<void> {
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
    this.getSurveyAppraisal(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  private getTasks(): void {
    this.collateralAppraisalProcessService.getTasks(this.id).subscribe(res => {
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
        if (this.collateralAppraisal.statusId === STATUS.ASSIGNED && this.collateralAppraisal.collateral.collateralTypeId !== 'MACHINE') {
          // run validation
          if (this.collateralProperties.length < MINIMUM_COMPARISON_DATA || this.fotoObjectJaminan.length < MINIMUM_OBJECT_JAMINAN_DATA) {
            if (this.collateralProperties.length < MINIMUM_COMPARISON_DATA) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Comparison data less than 3' });
            }

            if (this.fotoObjectJaminan.length < MINIMUM_OBJECT_JAMINAN_DATA) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Foto object jaminan data less than 6' });
            }
          } else {
            this.collateralAppraisalProcessService.processTask(_res).subscribe(res => {
              this.router.navigate(['./collateral-appraisal']);
            });
          }
        }

        if (this.collateralAppraisal.statusId === STATUS.ASSIGNMENT) {
          if (this.surveyAppraisal.apprOfficer === 'Internal') {
            if (!this.surveyAppraisal.surveyorArea) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Wilayah/kota terlebih dahulu' });
              return;
            }
            if (!this.surveyAppraisal.surveyorId) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Officer Appraisal terlebih dahulu' });
              return;
            }
          } else if (this.surveyAppraisal.apprOfficer === 'External') {
            if (!this.kjppIndependentAppraisalValue) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Masukkan KJPP / Independent Appraisal terlebih dahulu',
              });
            }
            if (!this.teamReviewerValue) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Officer Appraisal terlebih dahulu' });
            }
            if (!this.wilayahKotaExternalValue) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Wilayah/kota terlebih dahulu' });
            }
          } else {
            this.collateralAppraisalProcessService.processTask(_res).subscribe(res => {
              this.router.navigate(['./collateral-appraisal']);
            });
          }
        } else {
          this.collateralAppraisalProcessService.processTask(_res).subscribe(res => {
            this.router.navigate(['./collateral-appraisal']);
          });
        }
      }
    });
    this.onSave();
  }

  // check foto object jaminan
  public getFilesByKey(_key: string): void {
    const obj: Object = { key: _key };
    this.storageService.getObjects(this.bucket, obj).subscribe((res: any) => {
      this.fotoObjectJaminan = res.body;
    });
  }

  public getBucketName(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  // check comparison
  private getCollateralPropertyByCollateralId(id: number): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: id, page: 0, size: 9999, idPropertyType: CollateralPropertyType.COMPARISON })

      .subscribe(res => {
        this.collateralProperties = res.body;

        for (let index = 0; index < res.body.length; index++) {
          this.collateralProperties[index].attributes['comparison'] = JSON.parse(this.collateralProperties[index].attributes['comparison']);
        }
        this.collateralAppraisalService.totalDataComparison = res.body;
      });
  }

  private getSurveyAppraisal(cifId: string): void {
    this.surveyAppraisalsService.find(cifId).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
      this.cif = res.body['cif'] !== null ? res.body['cif'] : new Cif();
    });
  }

  public addNewCriteria(data: IScoreCard[]): void {
    this.collateralAppraisal.attributes['scoreCard'] = data;
  }

  private preSave(): ISurveyAppraisals {
    const copySurveyAppraisal = lodash.cloneDeep(this.surveyAppraisal);
    copySurveyAppraisal.attributes['scoreCard'] = JSON.stringify(copySurveyAppraisal.attributes['scoreCard']);
    copySurveyAppraisal.attributes['summary'] = JSON.stringify(copySurveyAppraisal.attributes['summary']);
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

  public onSave(): void {
    // console.log(this.surveyAppraisal);
    // if (this.surveyAppraisal.apprOfficer === 'Internal') {
    //   if (!this.surveyAppraisal.surveyorArea) {
    //     this._snackBar.open('Masukkan Wilayah/kota terlebih dahulu', null, {
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //       duration: 3000,
    //     });
    //     return;
    //   }
    //   if (!this.surveyAppraisal.surveyorId) {
    //     this._snackBar.open('Masukkan Officer Appraisal terlebih dahulu', null, {
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //       duration: 3000,
    //     });
    //     return;
    //   }
    // }
    // if (this.surveyAppraisal.apprOfficer === 'External') {
    //   if (!this.kjppIndependentAppraisalValue) {
    //     this._snackBar.open('Masukkan KJPP / Independent Appraisal terlebih dahulu', null, {
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //       duration: 3000,
    //     });
    //   }
    //   if (!this.teamReviewerValue) {
    //     this._snackBar.open('Masukkan Team Reviewer terlebih dahulu', null, {
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //       duration: 3000,
    //     });
    //   }
    //   if (!this.wilayahKotaExternalValue) {
    //     this._snackBar.open('Masukkan Wilayah/kota terlebih dahulu', null, {
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //       duration: 3000,
    //     });
    //   }
    // }
    const copySurveyAppraisal: ISurveyAppraisals = this.preSave();
    if (copySurveyAppraisal.id) {
      this.surveyAppraisalsService.update(copySurveyAppraisal).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save Success' });
      });
    } else {
      this.surveyAppraisalsService.create(copySurveyAppraisal).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save Success' });
      });
    }

    if (this.collateralAppraisal.statusId === STATUS.ASSIGNED) {
      // get comparison data
      this.getCollateralPropertyByCollateralId(this.collateralAppraisal.collateralId);
      // get foto object jaminan
      this.getBucketName().then(val => {
        this.getFilesByKey(`/appraisals/${this.collateralAppraisal.id}/jaminan`);
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

  public onValCollateralItemChanged(ev: any): void {
    console.log('ev @onValCollateralItemChanged collateral-appraisal-main: ', ev);
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
          { text: 'Foto Object Jaminan' },
          { text: 'Summary' },
        ];
      } else {
        this.menuItems = [
          { text: 'Appraisal Info' },
          { text: 'Customer Info' },
          { text: 'Collateral Info' },
          { text: 'Valuation' },
          { text: 'Comparison Data' },
          { text: 'Foto Object Jaminan' },
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
        if (this.collateralAppraisalService.totalDataValuationLand.length > 0) {
          dataLand = this.collateralAppraisalService.totalDataValuationLand.filter(
            obj => obj.propertyMarketValue === null || obj.propertyPercentage === null
          );
          if (dataLand.length === 0) {
            if (this.collateralAppraisalService.totalDataValuationBuilding.length > 0) {
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
        if (this.collateralAppraisalService.totalDataValuationVehicle.length > 0) {
          dataVehicle = this.collateralAppraisalService.totalDataValuationBuilding.filter(
            obj => obj.propertyMarketValue === null || obj.propertyPercentage === null
          );
          if (dataVehicle.length === 0) {
            return true;
          }
        }
      } else if (this.collateralAppraisal.collateral.collateralTypeId === 'MACHINE') {
        let dataMachine = [];
        if (this.collateralAppraisalService.totalDataValuationMachine.length > 0) {
          dataMachine = this.collateralAppraisalService.totalDataValuationMachine.filter(
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
      return true;
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
            return true;
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

  public routeSubMenu(menu: object): void {
    this.router.navigate(['/collateral-appraisal', this.id, 'edit'], { queryParams: { subroute: menu['id'] } });
  }
}
