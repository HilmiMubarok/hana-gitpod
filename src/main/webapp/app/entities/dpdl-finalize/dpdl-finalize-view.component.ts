import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import {
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
  DPDL_FINALIZE,
  BASIC_SUBMENU_CREDITPROPOSAL,
  DPDL_FINALIZE_APPEAL,
} from 'app/shared/constants/base.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { IDpdlFinalizeModel } from './dpdl-finalize.model';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { ICollateral } from '../collateral/collateral.model';
import { CollateralService } from '../collateral/collateral.service';
import { PartyCifService } from '../party-cif/party-cif.service';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { StorageService } from '../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { LendingProgramParameterService } from '../lending-program-parameter/lending-program-parameter.service';
import { Account } from 'app/core/auth/account.model';
import { formatBytes } from 'app/shared/helper/utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-dpdl-finalize-view',
  templateUrl: './dpdl-finalize-view.component.html',
  styleUrls: ['./dpdl-finalize.styles.css'],
})
export class DpdlFinalizeViewComponent implements OnInit {
  public isOpen = false;
  public subMenu: object[];
  public parentPath = this.router.url.split('/')[1];
  public creditProposal: IDpdlFinalizeModel;
  public creditProposalStartState: IDpdlFinalizeModel;

  public parentSubject: Subject<any> = new Subject();
  public clickedMenu: string;
  public headerTitle = 'select proposal type';
  public routeHelper: string;
  private id: number;
  private collateral: ICollateral[] = [];
  listGroupCollateral: any;
  public collateralPropertyGroupData: ICollateralProperty[] = [];
  private collateralProperties: ICollateralProperty[] = [];
  public proposType = [];
  public isHistoryExist: boolean;
  private KEYG = 'credit_proposal/summary';
  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  public dataOfferingSPPK = [];
  public postalAdresss;
  public currentAccount: Account;
  public title: string;
  public lendingProgram = [];
  public valueCpLendingProgram: [];
  public activeRoute: string;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    protected collateralService: CollateralService,
    protected collateralPropertyService: CollateralPropertyService,
    private partyCifService: PartyCifService,
    public generalParameterService: GeneralParameterService,
    private storageService: StorageService,
    private http: HttpClient,
    public accountService: AccountService,
    private lendingProgramParameterService: LendingProgramParameterService,
    protected messageService: MessageService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.creditProposalStartState = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.activeRoute = this.router.url.replace(/\//g, '');
    this.clickedMenu = 'dar-summary';

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.clickedMenu = subRoute;
        this.showTextMenu();
      }
    });

    this.subMenu = this.creditProposal.attributes['previousOfferingLetter'] ? [...DPDL_FINALIZE_APPEAL] : DPDL_FINALIZE;
    this.isHistoryExist = this.creditProposal.attributes.previousHistory ? true : false;
  }

  ngOnInit() {
    this.showTextMenu();
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.lendingProgramParameter();
    this.lovProposalType();
    const passSummary = {
      strength: '',
      opportunities: '',
      weaknesses: '',
      threats: '',
    };
    this.creditProposal.attributes['tabSummary'] = this.creditProposal.attributes.tabSummary
      ? JSON.parse(this.creditProposal.attributes.tabSummary)
      : passSummary;
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });

    this.getBucketNameSummary();
  }

  getText(value: any): string {
    if (value === 'finalize-dpdl') {
      return 'Finalize DPDL';
    } else {
      return 'Finalize DPDL';
    }
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
        size: 999,
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
  public triggerToggle() {
    this.isOpen = !this.isOpen;
  }

  public previousState(): void {
    window.history.back();
  }

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

  public onClickRed(): void {
    this.parentSubject.next('red-clicked');
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

  public goToSubMenu(menu: string): void {
    this.clickedMenu = menu;
  }

  public showTextMenu(): void {
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

  public routeSubMenu(menu: object): void {
    this.routeHelper =
      this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3].substr(0, 4);

    this.router.navigate([this.routeHelper], {
      queryParams: {
        subroute: menu['id'],
      },
    });
  }

  // Untuk Summary Generate
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
