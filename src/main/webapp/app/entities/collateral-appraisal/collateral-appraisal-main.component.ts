import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

import { PersonService } from '../person/person.service';
import { IPerson, Person } from '../person/person.model';
import { PartyGroupService } from '../party-group/party-group.service';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-appraisal-main',
  templateUrl: './collateral-appraisal-main.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalMainComponent implements OnInit {
  constructor(
    private partyGroupService: PartyGroupService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public partyType: string;
  public collateralAppraisal: ICollateralAppraisal = new CollateralAppraisal();
  public person: IPerson = new Person();
  public partyGroup: IPartyGroup = new PartyGroup();
  public selectedMenuId: String;
  public menuItems: MenuItemModel[] = [
    {
      id: 'customer-info',
      text: 'Customer Info',
    },
    {
      id: 'collateral-info',
      text: 'Collateral Info',
    },
    {
      id: 'credit-proposal-info',
      text: 'Proposal Info',
    },
    {
      id: 'party-collateral-info',
      text: 'Data Nasabah & Jaminan',
    },
    {
      id: 'valuation-info',
      text: 'Valuation',
    },
    {
      id: 'negative-info',
      text: 'Negative Collateral',
    },
    {
      id: 'comparison-info',
      text: 'Comparison Data',
    },
    {
      id: 'foto-info',
      text: 'Foto Object Jaminan',
    },
    {
      id: 'summary-info',
      text: 'Summary',
    },
  ];

  ngOnInit(): void {
    this.collateralAppraisal = this.route.snapshot.data['content'];
    this.partyType = this.collateralAppraisal.partyTypeId === 'PARTY_GROUP' ? 'Corporate' : 'Individual';
    if (this.collateralAppraisal.partyTypeId === 'PARTY_GROUP') {
      this.partyGroupService.find(this.collateralAppraisal.partyId).subscribe((res: HttpResponse<IPartyGroup>) => {
        console.log('res.body party: ', res.body);
        this.partyGroup = res.body;
      });
    } else {
      this.personService.find(this.collateralAppraisal.partyId).subscribe((res: HttpResponse<IPerson>) => {
        console.log('res.body person: ', res.body);
        this.person = res.body;
      });
    }
    this.selectedMenuId = 'customer-info';
  }

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;
  }
}
