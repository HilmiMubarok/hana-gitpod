import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

import { PersonService } from '../person/person.service';
import { IPerson, Person } from '../person/person.model';
import { PartyGroupService } from '../party-group/party-group.service';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';
import { CollateralService } from '../collateral/collateral.service';
import { ICollateral, Collateral } from '../collateral/collateral.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { PartyCif, IPartyCif } from '../party-cif/party-cif.model';

import { Observable, of } from 'rxjs';
import { MenuComponent, FieldSettingsModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-collateral-appraisal-main',
  templateUrl: './collateral-appraisal-main.component.html',
  styleUrls: ['../layout-css/layout-css-template.css'],
})
export class CollateralAppraisalMainComponent implements OnInit {
  constructor(
    private partyGroupService: PartyGroupService,
    private personService: PersonService,
    private collateralService: CollateralService,
    private creditProposalService: CreditProposalService,
    private route: ActivatedRoute,
    protected router: Router,
    private partyCifService: PartyCifService
  ) {}

  @ViewChild('menu')
  private menuObj: MenuComponent;
  public menuFields: FieldSettingsModel = {
    text: ['text'],
  };
  public partyType: string;
  public selectedMenu: string;
  public collateralType: string;
  public applicationId: number;
  public applicationNumber: string;
  public tipeOfficerAppraisal?: string;
  // public applicationNumber: Observable<string>;
  public collateralAppraisal: ICollateralAppraisal[];
  public person: IPerson = new Person();
  public partyGroup: IPartyGroup = new PartyGroup();
  public primaryAddress: IPostalAddress = new PostalAddress();
  public collateral: ICollateral = new Collateral();
  public creditProposal: ICreditProposal = new CreditProposal();
  public partyCif: IPartyCif = new PartyCif();

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

  ngOnInit(): void {
    this.selectedMenu = 'Appraisal Info';

    this.partyCifService.find(105).subscribe((res: HttpResponse<IPartyCif>) => {
      console.log('res.body partyCif: ', res.body);
      this.collateralAppraisal = res.body['appraisals'];
      this.getCollateralById();
    });
  }

  public getCollateralById(): void {
    // this.collateralService.find(this.route.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICollateral>) => {
    this.collateralService.find(134).subscribe((res: HttpResponse<ICollateral>) => {
      console.log('res.body collateral: ', res.body);
      this.collateral = res.body;

      this.collateralType = 'PROPERTY';

      this.applicationId = res.body['applicationId'];
      this.getCreditProposal(this.collateral);
    });
  }

  public getCreditProposal(collateral: ICollateral): void {
    // this.creditProposalService.find(collateral['applicationId']).subscribe((res: HttpResponse<ICreditProposal>) => {
    this.creditProposalService.find(91).subscribe((res: HttpResponse<ICreditProposal>) => {
      console.log('res.body creditProposal: ', res.body);
      this.creditProposal = res.body;

      this.person = res.body['prospectPerson'];
      this.partyGroup = res.body['prospectOrganization'];
      this.partyType = res.body['prospectPerson'] ? 'Individual' : 'Corporate';

      this.applicationNumber = this.creditProposal['applicationNumber'];
      // this.applicationNumber = of(this.creditProposal['applicationNumber']);

      for (let i = 0; i < res.body.addresses.length; i++) {
        if (res.body.addresses[i].purposeTypeId === 'PRIMARY_LOCATION') {
          this.primaryAddress = res.body.addresses[i];
        }
      }
    });
  }

  onSave(ev: any): void {
    console.log('this.partyCif : ', this.partyCif);
    /* this.partyCifService.save(this.partyCif).subscribe((res: HttpResponse<IPartyCif>) => {
      console.log('res.body update partyCif : ', res.body);
    });*/
    this.router.navigate(['./collateral-appraisal']);
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public onValTipeOfficerAppraisalChanged(ev): void {
    this.tipeOfficerAppraisal = ev;
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
    }
  }
}
