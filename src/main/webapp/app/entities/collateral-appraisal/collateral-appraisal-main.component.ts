import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { CollateralAppraisalService } from './collateral-appraisal.service';
import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';
import { PersonService } from '../person/person.service';
import { IPerson, Person } from '../person/person.model';
import { PartyGroupService } from '../party-group/party-group.service';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { CollateralService } from '../collateral/collateral.service';
import { ICollateral, Collateral } from '../collateral/collateral.model';
import { CollateralPropertyService } from '../collateral-property/collateral-property.service';
import { ICollateralProperty, CollateralProperty } from '../collateral-property/collateral-property.model';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';
import { CollateralAppraisalProcessService } from './collateral-appraisal-process.service';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { MenuComponent, FieldSettingsModel } from '@syncfusion/ej2-angular-navigations';

import { IProcessTask } from 'app/shared/model/process-task.model';
import { IScoreCard, scoreCard } from './negative/score-card.constant';

import { ICif, Cif } from '../cif/cif.model';
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import { ISurveyAppraisals, SurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';

@Component({
  selector: 'jhi-collateral-appraisal-main',
  templateUrl: './collateral-appraisal-main.component.html',
  styleUrls: ['./collateral-appraisal-main.css'],
})
export class CollateralAppraisalMainComponent implements OnInit {
  private _collateralAppraisal: ICollateralAppraisal;

  get collateralAppraisal() {
    return this._collateralAppraisal;
  }

  set collateralAppraisal(item: ICollateralAppraisal) {
    this._collateralAppraisal = item;
  }

  private id: number;
  public tasks: IProcessTask[] = new Array<IProcessTask>();
  private currentAccount: Account;
  public accountAuthorities?: Object[];

  constructor(
    private collateralAppraisalService: CollateralAppraisalService,
    private personService: PersonService,
    private partyGroupService: PartyGroupService,
    private collateralPropertyService: CollateralPropertyService,
    private collateralService: CollateralService,
    private collateralAppraisalProcessService: CollateralAppraisalProcessService,
    private partyCifService: PartyCifService,
    private surveyAppraisalsService: SurveyAppraisalsService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.collateralAppraisal = this.activatedRoute.snapshot.data['content'];
  }

  @ViewChild('menu')
  private menuObj: MenuComponent;
  public menuFields: FieldSettingsModel = {
    text: ['text'],
  };
  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [
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

  public partyType: string;
  public person: IPerson = new Person();
  public partyGroup: IPartyGroup = new PartyGroup();
  public cif?: ICif = new Cif();
  public partyCif: IPartyCif;
  public collateralType: string;
  public collateral: ICollateral = new Collateral();
  public collateralProperty: ICollateralProperty[];
  public tipeOfficerAppraisal?: string;

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
      this.accountAuthorities = account['authorities'];
    });
    this.selectedMenu = 'Appraisal Info';
    this.getCustomerInfo();
    this.getCollateral(this.collateralAppraisal.collateralId).then(res => {
      this.onValTipeOfficerAppraisalChanged(this.collateralAppraisal.apprOfficer);
    });
    this.getTasks();
  }

  private getCustomerInfo(): void {
    this.partyType = this._collateralAppraisal.partyTypeId === 'PERSON' ? 'Individual' : 'Corporate';
    this.getSurveyAppraisal(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  private getCollateral(collateralId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.collateralService.find(collateralId).subscribe((res: HttpResponse<ICollateral>) => {
        this.collateral = res.body;
        this.collateralType = res.body['collateralTypeId'];
        resolve();
      });
    });
  }

  private getTasks(): void {
    this.collateralAppraisalProcessService.getTasks(this.id).subscribe(res => {
      this.tasks = res.body;
    });
  }

  public processTask(task: IProcessTask): void {
    this.collateralAppraisalProcessService.processTask(task).subscribe(res => {
      this.getTasks();
    });
  }

  /* private getPartyCif(cifNumber: string): void {
    this.partyCifService.find('cif/' + cifNumber).subscribe((res: HttpResponse<IPartyCif>) => {
	  console.log('res @getPartyCif collateralAppraisalMain : ', res);
      // if (res.body['customerType'] === 'PERSONAL') {
        // this.getPerson(res.body['prospectPerson']['id']);
      // } else {
        // this.getPartyGroup(res.body['prospectOrganization']['id']);
      // }

	  this.cif = res.body['cif'] !== null ? res.body['cif'] : new Cif();
    });
  } */

  private getSurveyAppraisal(cifId: string): void {
    this.surveyAppraisalsService.find(cifId).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
      console.log('res @getSurveyAppraisal collateralAppraisalMain : ', res);

      this.cif = res.body['cif'] !== null ? res.body['cif'] : new Cif();
    });
  }

  /* private getPerson(partyId: number): void {
    this.personService.find(partyId).subscribe((res: HttpResponse<IPerson>) => {
      this.person = res.body;
    });
  } */

  /* private getPartyGroup(partyId: number): void {
    this.partyGroupService.find(partyId).subscribe((res: HttpResponse<IPartyGroup>) => {
      this.partyGroup = res.body;
    });
  } */

  /* private getCollateralProperties() void {
	this.collateralPropertyService.find().subscribe((res: HttpResponse<ICollateralProperty>) => {
		console.log('res.body collateral properties : ', res.body);
		this.collateralProperty = res.body;
	});
  }*/

  public addNewCriteria(data: IScoreCard[]): void {
    this.collateralAppraisal.attributes['scoreCard'] = data;
  }

  public onSave(): void {
    this.collateralAppraisal.attributes['scoreCard'] = JSON.stringify(this._collateralAppraisal.attributes['scoreCard']);
    if (this.collateralAppraisal.id) {
      this.collateralAppraisalService.update(this.collateralAppraisal).subscribe(res => {
        this.router.navigate(['./collateral-appraisal']);
      });
    } else {
      this.collateralAppraisalService.create(this.collateralAppraisal).subscribe(res => {
        this.router.navigate(['./collateral-appraisal']);
      });
    }
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public onValTipeOfficerAppraisalChanged(ev: any): void {
    let isRoleAppraisalOfficer = false;
    let isRoleSU = false;

    if (this.accountService.hasAnyAuthority('ROLE_APPRAISAL_OFFICER')) {
      isRoleAppraisalOfficer = true;
    }

    if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      isRoleSU = true;
    }

    if (isRoleAppraisalOfficer || isRoleSU) {
      this.tipeOfficerAppraisal = ev;
      this.getMenuAppraisalOfficer(ev);
    }
  }

  public onValCollateralItemChanged(ev: any): void {
    console.log('ev @onValCollateralItemChanged collateral-appraisal-main: ', ev);
    /* for (let i = 0; i < ev.length; i++) {
      this.collateralProperty = [...new Set([...this.collateralProperty, ev[i]])];
    }*/
    // this.collateralAppraisalService.setCollateralProperty(this.collateralProperty);
  }

  public previousState(): void {
    window.history.back();
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
      if (this.collateralType === 'PROPERTY') {
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
            text: 'Foto Object Jaminan',
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
            text: 'Foto Object Jaminan',
          },
          {
            text: 'Summary',
          },
        ];
      }
    }
  }
}
