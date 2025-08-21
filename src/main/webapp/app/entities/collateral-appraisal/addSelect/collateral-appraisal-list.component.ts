import { Component, OnChanges, SimpleChanges, ViewChild, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { IPerson } from '../../person/person.model';
import { ICollateral } from '../../collateral/collateral.model';
import { MatDialog } from '@angular/material/dialog';

import { PartyCifService } from '../../party-cif/party-cif.service';
import { IPartyCif } from '../../party-cif/party-cif.model';

import { CreditProposalService } from '../../credit-proposal/credit-proposal.service';

import { ICif } from '../../cif/cif.model';
import { PartyPostalAddressService } from '../../party-postal-address/party-postal-address.service';
import { IPostalAddress, PostalAddress } from '../../postal-address/postal-address.model';
import { IPartyPostalAddress } from '../../party-postal-address/party-postal-address.model';
import { SurveyAppraisalsService } from '../../survey-appraisals/survey-appraisals.service';
import { ISurveyAppraisals, SurveyAppraisals } from '../../survey-appraisals/survey-appraisals.model';
import { CashSurveyAppraisalsService } from 'app/entities/survey-appraisals/cash-survey-appraisal.service';

import { Observable, of } from 'rxjs';
import { PageSettingsModel, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';

import { ChangeEventArgs } from '@syncfusion/ej2-angular-layouts';
import lodash from 'lodash';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogCollateralAppraisalCifComponent } from './dialog-collateral-appraisal-cif.component';
import { MessageService } from 'primeng/api';

import { AccountService } from 'app/core/auth/account.service';
import { IPartyGroup } from 'app/entities/party-group/party-group.model';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { LoginService } from 'app/login/login.service';
import { CollateralAppraisalsAppraiseService } from '../collateral-appraisal-process-appraise.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal-list.css'],
})
export class CollateralAppraisalListComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnChanges {
  @ViewChild('template') template: DialogComponent;
  @Input() cifNumber: string;
  public cifType?: string;
  public mappingStatusHelper: any = [];
  private collateral?: ICollateral;
  public collateralsData?: any[];
  public dataSelectedCheckbox?: ICollateral[] = [];
  private person?: IPerson;
  public cif?: ICif;
  public partyId?: string;
  public postalAddress: IPostalAddress;
  private surveyAppraisal?: ISurveyAppraisals;
  private surveyAppraisals: ISurveyAppraisals[] = new Array<ISurveyAppraisals>();
  public surveyAppraisalCross: ISurveyAppraisals;
  public showDetail: IPartyCif;
  public showDetails: IPartyGroup;
  private selectedPartyCif?: IPartyCif;
  public dialogSection: string;
  public showCollateral = false;
  public dialogVisible: boolean;
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };
  private internalIdLocStor: string;
  private positionIdLocStor: string;
  public statusCheckedGroupEmit: boolean;
  public paginatorLength: number;
  public paginatorPageSize: number;
  public surveyAppraisalTemplate: ISurveyAppraisals;
  public pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 2, pageSize: 5 };
  public displayedColumns: string[] = ['no', 'noCif', 'debiturName', 'debiturType', 'action'];
  public displayedColumnss: string[] = ['select', 'no', 'noCif', 'debiturName', 'debiturType', 'action'];
  public statusChecked = [];
  public isCheckDebCol: boolean;
  public InternalExternal = [];
  public partyIds?: string;
  statusCheckedGroupFromColl: boolean;
  public dataGroupCollateral?: ICollateral[] = [];
  public collateralsDataGroup?: any[];
  getsCif: IPartyCif[];
  public createSurveyAppraisalPromises = [];
  public collateralDetails: object[];
  public collateralCode: any;
  collateralCodeMatrik = [];
  // collateralValidate: any;
  // public collateralValidate = [];
  constructor(
    public dialog: MatDialog,
    protected router: Router,
    protected partyCifService: PartyCifService,
    protected partyPostalAddressService: PartyPostalAddressService,
    protected creditProposalService: CreditProposalService,
    protected surveyAppraisalsService: SurveyAppraisalsService,
    protected activatedRoute: ActivatedRoute,
    protected _snackBar: MatSnackBar,
    protected messageService: MessageService,
    protected accountService: AccountService,
    protected cashCollateralService: CashCollateralService,
    protected loginService: LoginService,
    protected cashSurveyAppraisalService: CashSurveyAppraisalsService,
    public collateralAppraisalsAppraiseService: CollateralAppraisalsAppraiseService
  ) {
    super(_snackBar, partyCifService);
    this.postalAddress = new PostalAddress();
    this.showDetail = null;

    this.page = 0;
    this.itemsPerPage = 10;
  }
  public checkedStatus(changeEventArgs: ChangeEventArgs, status: any) {
    if (changeEventArgs['checked'] === true) {
      this.statusChecked.push(status);
    } else {
      for (let i = 0; i < this.statusChecked.length; i++) {
        if (this.statusChecked[i] === status) {
          this.statusChecked.splice(i, 1);
          i = this.statusChecked.length - 1;
        }
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initialize();
    if (
      changes.cifNumber.currentValue === 'undefined' ||
      changes.cifNumber.currentValue === '' ||
      changes.cifNumber.currentValue === undefined
    ) {
      this.items = [];
    } else {
      this.getPartyCif();
    }
    this.getSurveyAppraisalsTemplate();
  }
  public selectCif(ev: IPartyCif): void {
    this.selectedPartyCif = ev;
    this.showCollateral = true;
    this.setAvailableCollateralForAppraise(ev.collaterals);
    if (this.collateralsData.length > 0) {
      for (let i = 0; i < this.collateralsData.length; i++) {
        this.collateralsData[i]['indexNum'] = i + 1;
      }
    }
  }

  private setAvailableCollateralForAppraise(collaterals: ICollateral[]): void {
    this.collateralsData = lodash.filter(collaterals, function (e) {
      return e.collateralTypeAppraise === true && e.statusId !== STATUS_COLLATERAL.CANCEL && e.statusId !== STATUS_COLLATERAL.RELEASE;
    });
  }

  private initialize(): void {
    this.showCollateral = false;
    this.dataSelectedCheckbox = [];
    this.dataGroupCollateral = [];
  }

  public onOpen(args: any) {
    args.preventFocus = true;
  }

  private getPartyCif(): void {
    this.loading = true;

    const predicate = {
      page: this.page,
      size: this.itemsPerPage,
      idPosition: this.getLocStor('POS'),
      sort: ['id', 'desc'],
    };

    if (this.cifNumber.length !== 10) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Maaf, data CIF yang Anda masukkan harus terdiri dari 10 digit. Silakan periksa kembali dan inputkan CIF yang valid.',
      });
    } else {
      this.partyCifService.findLikeCifSegregasi(this.cifNumber, predicate).subscribe(res => {
        if (res.body.length > 0) {
          this.initDataForMatTable(res, res.headers);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Saat ini CIF tidak ada pada system CASH. Silahkan find CIF Pada menu Initiation Debtor Data terlebih dahulu.',
          });
          this.initDataForMatTable(res, res.headers);
        }

        // Validation Kepemilikan Data - Start - Commented with wa group @28.12.2022 (Keys : Dwi)//
        /* let filteredData = [];
    this.accountService.identity().subscribe(account => {
      filteredData = lodash.filter(res.body, function (item: IPartyCif) {
        return item.rm.userLogin === account.login;
      });
    });
    if (filteredData.length > 0) {
      this.initDataForMatTable(res, res.headers);
    } else {
      this.messageService.add({ severity: 'info', summary: 'DATA CIF!!!', detail: 'DATA CIF TELAH DIAJUKAN OLEH RM LAIN' });
      // this.loading = false;
    }
    */
        // Validation Kepemilikan Data - End - Commented with wa group @28.12.2022 (Keys : Dwi)
      });
    }
  }

  protected postLoadDataLazy(): void {
    this.getPartyCif();
  }

  private getSurveyAppraisalsTemplate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.template(1).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
        this.surveyAppraisalTemplate = res.body;

        resolve();
      });
    });
  }

  private loadPartyPostalAddress(partyId: string, section: string): void {
    this.partyPostalAddressService.queryFilterBy({ idParty: partyId }).subscribe(res => {
      if (res.body.length > 0) {
        const partyPostalAddress: IPartyPostalAddress = lodash.find(res.body, function (o) {
          return o.purposeTypeId === 'PRIMARY_LOCATION';
        });
        if (partyPostalAddress) {
          const predicate = {
            height: '100%',
            width: '80vw',
            data: {
              collateral: this.collateral,
              partyId: this.showDetail.id,
              partyIds: this.showDetail.partyId,
              dialogSection: section,
              customerType: this.showDetail.customerType,
              postalAddress: partyPostalAddress,
            },
          };

          const dialogRef = this.dialog.open(DialogCollateralAppraisalCifComponent, predicate);
          dialogRef.afterClosed().subscribe();
          this.postalAddress = partyPostalAddress.address;
        }
      }
    });
  }

  // Implement dataStateChange only because not extend from abstractEJ2 with new service that get cifData with elastic --  End

  public onCifSelected(args: RowSelectEventArgs) {
    this.showCollateral = true;

    this.collateralsData = args.data['collaterals'].slice(0);
    for (let i = 0; i < this.collateralsData.length; i++) {
      this.collateralsData['indexNum'] = i + 1;
    }
  }

  // When onDetailClick, onCifSelected triggered after onDetailClick -- Because if clicked just a little bit outside element then 2 function fir

  public onDetailClick(section: string, data: any): void {
    this.showDetail = data;
    if (section === 'collateral') {
      this.collateral = data;
      this.partyId = this.showDetail.partyId;
    }

    if (section === 'cif') {
      this.partyId = this.showDetail.partyId;
    }

    this.loadPartyPostalAddress(this.partyId, section);
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }
  public getCifsFromChild(listGroupCollateral: any): void {
    this.getsCif = listGroupCollateral;
  }
  public getCollateralChecklist(statusCheckedGroupEmit: any): void {
    this.statusCheckedGroupFromColl = statusCheckedGroupEmit;
  }
  public getDataGroup(listDataGroup: ICollateral[]): void {
    this.dataSelectedCheckbox = listDataGroup;
  }
  public onChecked(event: MatCheckboxChange, index: number): void {
    if (event.checked === true) {
      this.dataSelectedCheckbox.push(this.collateralsData[index]);
      this.isCheckDebCol = true;
    } else if (event.checked === false) {
      for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
        if (this.dataSelectedCheckbox[i].id === this.collateralsData[index].id) {
          this.dataSelectedCheckbox.splice(i, 1);
          // i = this.dataSelectedCheckbox.length - 1;
        }
        this.isCheckDebCol = false;
      }
    }
  }
  private createSurveyAppraisal(surveyAppraisal: ISurveyAppraisals): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.create(surveyAppraisal, { idPosition: this.getLocStor('POS') }).subscribe(res => {
        resolve();
      });
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

  public onAdd(): void {
    this.collateralAppraisalsAppraiseService.setLoading(true);
    this.internalIdLocStor = this.getLocStor('INT');
    this.positionIdLocStor = this.getLocStor('POS');
    if (!this.internalIdLocStor || !this.positionIdLocStor) {
      this.logout();
    } else {
      if (!this.internalIdLocStor) {
        this.logout();
      } else {
        this.collateralAppraisalsAppraiseService.setLoading(true);
        if (this.statusChecked.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Silahkan pilih Appraisal Officer Type' });
          this.collateralAppraisalsAppraiseService.setLoading(false);
        } else {
          this.InternalExternal = [];
          for (let i = 0; i < this.statusChecked.length; i++) {
            this.InternalExternal.push(this.statusChecked[i]);
          }
          if (this.dataSelectedCheckbox.length === 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Silahkan pilih Collateral' });
            this.collateralAppraisalsAppraiseService.setLoading(false);
          } else {
            for (let e = 0; e < this.statusChecked.length; e++) {
              for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
                this.collateralAppraisalsAppraiseService.validateAppraise([this.dataSelectedCheckbox[i]]).subscribe({
                  error: (error: HttpErrorResponse) => {
                    if (error.status === 500) {
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                          'Collateral' +
                          ' ' +
                          this.dataSelectedCheckbox[i].collateralNumber +
                          ' ' +
                          ' ' +
                          this.dataSelectedCheckbox[i].collateralTypeDescription +
                          ' ' +
                          'masih dalam proses appraisal.',
                        life: 7000,
                      });
                      this.collateralAppraisalsAppraiseService.setLoading(false);
                    } else {
                      this.surveyAppraisalCross = lodash.clone(this.surveyAppraisalTemplate);
                      if (this.selectedPartyCif?.partyId === this.dataSelectedCheckbox[i].partyId) {
                        if (this.selectedPartyCif.customerType === 'PERSONAL') {
                          this.surveyAppraisalCross.partyId = this.selectedPartyCif.customerPerson.id;
                        } else {
                          this.surveyAppraisalCross.partyId = this.selectedPartyCif.customerOrganization.id;
                        }
                      } else {
                        for (let j = 0; j < this.getsCif.length; j++) {
                          if (this.dataSelectedCheckbox[i].partyId === this.getsCif[j].customerPartyId) {
                            if (this.getsCif[j].customerType === 'PERSONAL') {
                              this.surveyAppraisalCross.partyId = this.getsCif[j].customerPartyId;
                            } else {
                              this.surveyAppraisalCross.partyId = this.getsCif[j].customerPartyId;
                            }
                          }
                        }
                      }
                      this.surveyAppraisalCross.apprOfficer = this.statusChecked[e];
                      this.surveyAppraisalCross.collateralId = this.dataSelectedCheckbox[i].id;
                      this.surveyAppraisalCross.collateralTypeDescription = this.dataSelectedCheckbox[i].collateralTypeDescription;
                      this.surveyAppraisalCross.internalId = this.internalIdLocStor;
                      this.surveyAppraisalCross.applicationId = null;
                      console.log(this.createSurveyAppraisalPromises);
                      this.createSurveyAppraisalPromises.push(this.createSurveyAppraisal(this.surveyAppraisalCross));
                      Promise.all(this.createSurveyAppraisalPromises).then(results => {
                        this.router.navigate(['./collateral-appraisal']);
                        this.collateralAppraisalsAppraiseService.setLoading(false);
                      });
                    }
                  },
                });
                //
              }
            }
          }
        }
      }
    }
  }
  private logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
