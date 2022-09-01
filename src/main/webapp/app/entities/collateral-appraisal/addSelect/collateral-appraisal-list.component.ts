// import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Component, OnChanges, SimpleChanges, ViewChild, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { IPerson, Person } from '../../person/person.model';
import { PartyGroup } from '../../party-group/party-group.model';
import { ICollateral, Collateral } from '../../collateral/collateral.model';
import { ICollateralAppraisal, CollateralAppraisal } from '../collateral-appraisal.model';

import { PartyCifService } from '../../party-cif/party-cif.service';
import { IPartyCif, PartyCif } from '../../party-cif/party-cif.model';

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

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal-list.css'],
})
export class CollateralAppraisalListComponent implements OnChanges {
  @ViewChild('template') template: DialogComponent;
  @Input() cifNumber: string;
  public cifType?: string;

  private partyCif?: IPartyCif[];
  public partyCifData: Observable<{
    result: any[];
    count: number;
  }>;
  private collateral?: ICollateral;
  private collateralAppraisal?: ICollateralAppraisal;
  // private collateralsData?: ICollateral[];
  private collateralsData?: any[];
  public dataSelectedCheckbox?: ICollateral[] = [];
  private person?: IPerson;
  public cif?: ICif;
  public partyId?: string;
  public postalAddress: IPostalAddress;
  private surveyAppraisal?: ISurveyAppraisals;
  private surveyAppraisals: ISurveyAppraisals[] = new Array<ISurveyAppraisals>();

  public showDetail: ISurveyAppraisals;
  private selectedPartyCif: IPartyCif;
  public dialogSection: string;
  public showCollateral = false;
  public dialogVisible: boolean;
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  public partyCifs: IPartyCif[];
  public surveyAppraisalTemplate: ISurveyAppraisals;
  public pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 2, pageSize: 5 };
  public displayedColumns: string[] = ['no', 'noCif', 'debiturName', 'debiturType', 'action'];

  constructor(
    protected router: Router,
    protected partyCifService: PartyCifService,
    protected partyPostalAddressService: PartyPostalAddressService,
    protected creditProposalService: CreditProposalService,
    protected surveyAppraisalsService: SurveyAppraisalsService,
    protected activatedRoute: ActivatedRoute
  ) {
    this.postalAddress = new PostalAddress();
    this.partyCifs = [];
    this.showDetail = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initialize();

    if (
      changes.cifNumber.currentValue === 'undefined' ||
      changes.cifNumber.currentValue === '' ||
      changes.cifNumber.currentValue === undefined
    ) {
      // Do nothing
    } else {
      this.getPartyCif();
    }
    this.getSurveyAppraisalsTemplate();
  }

  public selectCif(ev: IPartyCif): void {
    this.selectedPartyCif = ev;
    this.showCollateral = true;
    this.collateralsData = ev.collaterals;
    if (this.collateralsData.length > 0) {
      for (let i = 0; i < this.collateralsData.length; i++) {
        this.collateralsData[i]['indexNum'] = i + 1;
      }
    }
  }

  private initialize(): void {
    const passPartyCifData = {
      result: [],
      count: 0,
    };

    this.showCollateral = false;
    this.partyCifData = of(passPartyCifData);
    this.dataSelectedCheckbox = [];
  }

  public onOpen(args: any) {
    args.preventFocus = true;
  }

  private getPartyCif(): void {
    const passPartyCifData = {
      result: [],
      count: 0,
    };

    this.partyCifService.findLikeCif(this.cifNumber).subscribe(res => {
      this.partyCifs = res.body;
      this.partyCif = res.body;
      this.partyCifData = of(passPartyCifData);
    });
  }

  private getSurveyAppraisalsTemplate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.template(1).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
        this.surveyAppraisalTemplate = res.body;
        resolve();
      });
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

  // Implement dataStateChange only because not extend from abstractEJ2 with new service that get cifData with elastic --  End

  public onCifSelected(args: RowSelectEventArgs) {
    this.showCollateral = true;

    // this.collateralsData = args.data['collaterals'];
    this.collateralsData = args.data['collaterals'].slice(0);
    for (let i = 0; i < this.collateralsData.length; i++) {
      this.collateralsData['indexNum'] = i + 1;
    }
  }

  // When onDetailClick, onCifSelected triggered after onDetailClick -- Because if clicked just a little bit outside element then 2 function fir

  public onDetailClick(section: string, data: ICollateral | ISurveyAppraisals | any): void {
    this.dialogVisible = true;
    this.dialogSection = section;

    if (section === 'collateral') {
      this.collateral = data;
    }

    if (section === 'cif') {
      this.showDetail = data;
      if (this.showDetail.partyTypeId === 'PERSON') {
        this.partyId = this.showDetail.prospectPerson.id;
      } else {
        this.partyId = this.showDetail.prospectOrganization.id;
      }
      this.loadPartyPostalAddress(this.partyId);
    }
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

  public onAdd(): void {
    this.partyCif['appraisals'] = [];
    this.collateralAppraisal = new CollateralAppraisal();

    for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
      const surveyAppraisal: ISurveyAppraisals = lodash.clone(this.surveyAppraisalTemplate);
      surveyAppraisal.partyId =
        this.selectedPartyCif.customerType === 'PERSONAL'
          ? this.selectedPartyCif.prospectPerson.id
          : this.selectedPartyCif.prospectOrganization.id;
      surveyAppraisal.applicationId = this.selectedPartyCif.id;
      surveyAppraisal.collateralId = this.dataSelectedCheckbox[i].id;
      surveyAppraisal.collateralTypeDescription = this.dataSelectedCheckbox[i].collateralTypeDescription;

      this.surveyAppraisalsService.create(surveyAppraisal).subscribe();
    }
    this.router.navigate(['./collateral-appraisal']);
  }
}
