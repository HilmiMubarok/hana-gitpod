// import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Component, OnChanges, SimpleChanges, ViewChild, Input } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { IPerson, Person } from '../../person/person.model';
import { IPartyGroup, PartyGroup } from '../../party-group/party-group.model';
import { ICollateral, Collateral } from '../../collateral/collateral.model';
import { ICollateralAppraisal, CollateralAppraisal } from '../collateral-appraisal.model';

import { PartyCifService } from '../../party-cif/party-cif.service';
import { IPartyCif, PartyCif } from '../../party-cif/party-cif.model';

import { CreditProposalService } from '../../credit-proposal/credit-proposal.service';

import { ICif, Cif } from '../../cif/cif.model';
import { PartyPostalAddressService } from '../../party-postal-address/party-postal-address.service';
import { IPostalAddress, PostalAddress } from '../../postal-address/postal-address.model';
import { IPartyPostalAddress } from '../../party-postal-address/party-postal-address.model';
import { SurveyAppraisalsService } from '../../survey-appraisals/survey-appraisals.service';
import { ISurveyAppraisals, SurveyAppraisals } from '../../survey-appraisals/survey-appraisals.model';

import { Observable, of } from 'rxjs';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { PageSettingsModel, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';

import { ChangeEventArgs } from '@syncfusion/ej2-angular-layouts';
import lodash from 'lodash';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal-list.css'],
})
// export class CollateralAppraisalListComponent implements OnInit {
export class CollateralAppraisalListComponent implements OnChanges {
  @ViewChild('template') template: DialogComponent;
  @Input() cifNumber: string;
  public cifType?: string;

  private partyCif?: IPartyCif;
  public partyCifData: Observable<{
    result: any[];
    count: number;
  }>;
  private collateral?: ICollateral;
  // private collateralsData?: ICollateral[];
  private collateralsData?: any[];
  public dataSelectedCheckbox?: ICollateral[] = [];
  private person?: IPerson;
  private partyGroup?: IPartyGroup;
  public cif?: ICif;
  public partyId?: string;
  public postalAddress: IPostalAddress;
  private collateralAppraisal: ICollateralAppraisal = new CollateralAppraisal();
  private surveyAppraisal?: ISurveyAppraisals;
  private surveyAppraisals: ISurveyAppraisals[] = new Array<ISurveyAppraisals>();

  public dialogSection: string;
  public showCollateral = false;
  public dialogVisible: boolean;
  public width = '90%';
  public height = '90%';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  public pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 2, pageSize: 5 };

  constructor(
    protected router: Router,
    protected partyCifService: PartyCifService,
    protected partyPostalAddressService: PartyPostalAddressService,
    protected creditProposalService: CreditProposalService,
    protected surveyAppraisalsService: SurveyAppraisalsService
  ) {
    this.postalAddress = new PostalAddress();
  }

  // Implement onInit only because not extend from abstractEJ2 with new service that get cifData with elastic --  Start
  /* ngOnInit() {
    // Use this because mock only at creditProposalService -- Start
    this.creditProposalService.find('cif/' + this.cifNumber).subscribe((res: HttpResponse<ICreditProposal>) => {
      this.getPartyCif();
    });
    // Use this because mock only at creditProposalService -- End
  } */
  // Implement onInit only because not extend from abstractEJ2 with new service that get cifData with elastic --  End

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
    const passPartyCif = {};

    this.partyCifService.find('cif/' + this.cifNumber).subscribe((res: HttpResponse<IPartyCif>) => {
      this.partyCif = res.body;
      // this.partyCif = structuredClone(res.body);

      // this.partyCif = new PartyCif;
      /* for (const attr in res.body) {
		if (Object.prototype.hasOwnProperty.call(res.body, attr)) {
		  this.partyCif[attr] = res.body[attr];
		}
	  } */

      // Can do this because only return 1 object with current service & if using new service that get cifData with elastic, this will throw error -- Start
      for (const attr in res.body) {
        if (Object.prototype.hasOwnProperty.call(res.body, attr)) {
          passPartyCif[attr] = res.body[attr];
        }
      }
      passPartyCifData.result.push(passPartyCif);
      passPartyCifData.result[0]['indexNum'] = 1;
      passPartyCifData.result[0]['name'] =
        res.body['customerType'] === 'PERSONAL' ? res.body['prospectPerson']['name'] : res.body['prospectOrganization']['name'];
      // Can do this because only return 1 object with current service & if using new service that get cifData with elastic, this will throw error -- Start
      passPartyCifData.count = 1;
      this.partyCifData = of(passPartyCifData);

      this.cifType = res.body.customerType;
      // this.person = res.body.customerType === 'PERSONAL' ? res.body.prospectPerson : new Person();
      // this.partyGroup = res.body.customerType === 'CORPORATE' ? res.body.prospectOrganization : new PartyGroup();

      if (res.body.customerType === 'PERSONAL') {
        this.person = res.body.prospectPerson;
        this.partyGroup = new PartyGroup();
        this.partyId = res.body.prospectPerson.id;
        this.loadPartyPostalAddress(res.body.prospectPerson.id);
      } else if (res.body.customerType === 'CORPORATE') {
        this.person = new Person();
        this.partyGroup = res.body.prospectOrganization;
        this.partyId = res.body.prospectOrganization.id;
        this.loadPartyPostalAddress(res.body.prospectOrganization.id);
      }

      if (res.body.cif !== null) {
        this.cif = res.body.cif;
      }

      this.getSurveyAppraisalsTemplate();
    });
  }

  private getSurveyAppraisalsTemplate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.surveyAppraisalsService.template(1).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
        this.surveyAppraisal = res.body;
        resolve();
      });
    });
  }

  /* private surveyAppraisalsTemplateCallBack(): void{
	return function() {
	  this.getSurveyAppraisalsTemplate();
	};
  } */

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

  // Implement dataStateChange only because not extend from abstractEJ2 with new service that get cifData with elastic --  Start
  public dataStateChange(state: DataStateChangeEventArgs): void {
    console.log('dataStateChange');
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

  public onDetailClick(section: string, data: ICollateral | any): void {
    this.dialogVisible = true;
    this.dialogSection = section;

    if (section === 'collateral') {
      this.collateral = data;
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
    let passSurveyAppraisal: ISurveyAppraisals;
    this.partyCif['appraisals'] = [];
    this.collateralAppraisal = new CollateralAppraisal();

    for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
      passSurveyAppraisal = new SurveyAppraisals();
      for (const [key, value] of Object.entries(this.surveyAppraisal)) {
        if (Object.prototype.hasOwnProperty.call(this.surveyAppraisal, key)) {
          passSurveyAppraisal[key] = this.surveyAppraisal[key];
        }
      }
      passSurveyAppraisal.partyId =
        this.partyCif.customerType === 'PERSONAL' ? this.partyCif.prospectPerson.id : this.partyCif.prospectOrganization.id;
      passSurveyAppraisal.applicationId = this.partyCif.id;
      passSurveyAppraisal.collateralId = this.dataSelectedCheckbox[i].id;
      passSurveyAppraisal.collateralTypeDescription = this.dataSelectedCheckbox[i].collateralTypeDescription;

      this.surveyAppraisals.push(passSurveyAppraisal);
    }

    // Done
    for (let i = 0; i < this.surveyAppraisals.length; i++) {
      this.surveyAppraisalsService.create(this.surveyAppraisals[i]).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
        this.router.navigate(['./collateral-appraisal']);
      });
    }
  }
}
