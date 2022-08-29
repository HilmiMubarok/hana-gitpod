import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private collateralAppraisalProcessService: CollateralAppraisalProcessService,
    private surveyAppraisalsService: SurveyAppraisalsService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.collateralAppraisal = this.activatedRoute.snapshot.data['content'];
    this.surveyAppraisal = new SurveyAppraisals();
  }

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
    this.getDataSurveyAppraisal().then(res => {
      this.onValTipeOfficerAppraisalChanged(this.surveyAppraisal.apprOfficer);
    });
    this.getTasks();
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
    this.collateralAppraisalProcessService.processTask(task).subscribe(res => {
      this.getTasks();
    });
  }

  private getSurveyAppraisal(cifId: string): void {
    this.surveyAppraisalsService.find(cifId).subscribe((res: HttpResponse<ISurveyAppraisals>) => {
      console.log('res @getSurveyAppraisal collateralAppraisalMain : ', res);

      this.cif = res.body['cif'] !== null ? res.body['cif'] : new Cif();
    });
  }

  public addNewCriteria(data: IScoreCard[]): void {
    this.surveyAppraisal.attributes['scoreCard'] = data;
  }

  public onSave(): void {
    this.surveyAppraisal.attributes['scoreCard'] = JSON.stringify(this._surveyAppraisal.attributes['scoreCard']);
    if (this.surveyAppraisal.id) {
      this.surveyAppraisalsService.update(this.surveyAppraisal).subscribe(res => {
        this.router.navigate(['./collateral-appraisal']);
      });
    } else {
      this.surveyAppraisalsService.create(this.surveyAppraisal).subscribe(res => {
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
