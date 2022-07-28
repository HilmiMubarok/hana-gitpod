import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
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

import { Observable, of } from 'rxjs';

@Component({
  selector: 'jhi-collateral-appraisal-main',
  templateUrl: './collateral-appraisal-main.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalMainComponent implements OnInit {
  constructor(
    private partyGroupService: PartyGroupService,
    private personService: PersonService,
    private collateralService: CollateralService,
    private creditProposalService: CreditProposalService,
    private route: ActivatedRoute
  ) {}

  public partyType: string;
  public selectedMenuId: string;
  public applicationId: number;
  public applicationNumber: string;
  // public applicationNumber: Observable<string>;
  public collateralAppraisal: ICollateralAppraisal = new CollateralAppraisal();
  public person: IPerson = new Person();
  public partyGroup: IPartyGroup = new PartyGroup();
  public primaryAddress: IPostalAddress = new PostalAddress();
  public collateral: ICollateral = new Collateral();
  public creditProposal: ICreditProposal = new CreditProposal();

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
    this.selectedMenuId = 'customer-info';

    this.collateralService.find(this.route.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICollateral>) => {
      console.log('res.body collateral: ', res.body);
      this.collateral = res.body;
      this.applicationId = res.body['applicationId'];
      // this.collateralAppraisal =
      this.getCreditProposal(this.collateral);
    });
  }

  getCreditProposal(collateral: ICollateral): void {
    // this.creditProposalService.find(collateral['applicationId']).subscribe((res: HttpResponse<ICreditProposal>) => {
    this.creditProposalService.find(108).subscribe((res: HttpResponse<ICreditProposal>) => {
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

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;
  }
}
