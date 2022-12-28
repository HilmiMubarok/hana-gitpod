import { Component, OnChanges, SimpleChanges, ViewChild, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
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

import { Observable, of } from 'rxjs';
import { PageSettingsModel, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';

import { ChangeEventArgs } from '@syncfusion/ej2-angular-layouts';
import lodash from 'lodash';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogCollateralAppraisalCifComponent } from './dialog-collateral-appraisal-cif.component';
import { MessageService } from 'primeng/api';

import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal-list.css'],
})
export class CollateralAppraisalListComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnChanges {
  @ViewChild('template') template: DialogComponent;
  @Input() cifNumber: string;
  public cifType?: string;

  private collateral?: ICollateral;
  private collateralsData?: any[];
  public dataSelectedCheckbox?: ICollateral[] = [];
  private person?: IPerson;
  public cif?: ICif;
  public partyId?: string;
  public postalAddress: IPostalAddress;
  private surveyAppraisal?: ISurveyAppraisals;
  private surveyAppraisals: ISurveyAppraisals[] = new Array<ISurveyAppraisals>();

  public showDetail: IPartyCif;
  private selectedPartyCif: IPartyCif;
  public dialogSection: string;
  public showCollateral = false;
  public dialogVisible: boolean;
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  public paginatorLength: number;
  public paginatorPageSize: number;
  public surveyAppraisalTemplate: ISurveyAppraisals;
  public pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 2, pageSize: 5 };
  public displayedColumns: string[] = ['no', 'noCif', 'debiturName', 'debiturType', 'action'];
  public statusChecked = [];
  public InternalExternal = [];

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
    protected accountService: AccountService
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
      return e.collateralTypeAppraise === true;
    });
  }

  private initialize(): void {
    this.showCollateral = false;
    this.dataSelectedCheckbox = [];
  }

  public onOpen(args: any) {
    args.preventFocus = true;
  }

  private getPartyCif(): void {
    this.loading = true;

    const predicate = {
      page: this.page,
      size: this.itemsPerPage,
      sort: ['id', 'desc'],
    };

    this.partyCifService.findLikeCif(this.cifNumber, predicate).subscribe(res => {
	  // this.initDataForMatTable(res, res.headers);
	  if (res.rm.userLogin) {
		let filteredData = [];
		this.accountService.identity().subscribe(account => {
		  filteredData = lodash.filter(res, function (item: IPartyCif) {
			return item.rm.userLogin === account.login;
		  });
		});
		if (filteredData.length > 0) {
		  this.initDataForMatTable(res, res.headers);
		} else {
		  this.messageService.add({ severity: 'info', summary: 'Data Tidak Ada', detail: 'Cif ini tidak terdaftar atas RM yang login' });
		  this.loading = false;
		}
	  }
    });
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
              partyId: this.showDetail.customerNumber,
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

  public onChecked(changeEventArgs: ChangeEventArgs, value: ICollateral): void {
    if (changeEventArgs['checked'] === true) {
      this.dataSelectedCheckbox.push(value);
    } else {
      for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
        if (this.dataSelectedCheckbox[i]['id'] === value['id']) {
          this.dataSelectedCheckbox.splice(i, 1);
          i = this.dataSelectedCheckbox.length - 1;
        }
      }
    }
  }

  private createSurveyAppraisal(surveyAppraisal: ISurveyAppraisals): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.create(surveyAppraisal).subscribe(res => {
        resolve();
      });
    });
  }

  public onAdd(): void {
    if (this.statusChecked.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Silahkan pilih Appraisal Officer Type' });
    } else {
      const createSurveyAppraisalPromises = [];
      this.InternalExternal = [];

      for (let i = 0; i < this.statusChecked.length; i++) {
        this.InternalExternal.push(this.statusChecked[i]);
      }

      for (let e = 0; e < this.statusChecked.length; e++) {
        for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
          const surveyAppraisal: ISurveyAppraisals = lodash.clone(this.surveyAppraisalTemplate);

          surveyAppraisal.partyId =
            this.selectedPartyCif.customerType === 'PERSONAL'
              ? this.selectedPartyCif.customerPerson.id
              : this.selectedPartyCif.customerOrganization.id;
          surveyAppraisal.applicationId = null;
          surveyAppraisal.collateralId = this.dataSelectedCheckbox[i].id;
          surveyAppraisal.collateralTypeDescription = this.dataSelectedCheckbox[i].collateralTypeDescription;

          surveyAppraisal.apprOfficer = this.InternalExternal[e];

          createSurveyAppraisalPromises.push(this.createSurveyAppraisal(surveyAppraisal));
        }
      }

      Promise.all(createSurveyAppraisalPromises).then(results => {
        this.router.navigate(['./collateral-appraisal']);
      });
    }
  }
}
