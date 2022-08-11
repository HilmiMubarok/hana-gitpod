/* import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PersonService } from '../person/person.service';
import { IPerson, Person } from '../person/person.model';
import { PartyGroupService } from '../party-group/party-group.service';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';

import { ICollateral, Collateral } from '../collateral/collateral.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';
import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';

import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-appraisal-data-nasabah',
  templateUrl: './collateral-appraisal-data-nasabah.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalDataNasabahComponent {
  public person: IPerson = new Person();
  public partyGroup: IPartyGroup = new PartyGroup();

  public dataSelectedCheckbox?: ICollateral[];
  public partyCif: IPartyCif = new PartyCif();
  public collateralAppraisal: ICollateralAppraisal = new CollateralAppraisal();

  public responseCif: string;
  public searchInput: string;

  constructor(private creditProposalService: CreditProposalService, private router: Router, private partyCifService: PartyCifService, private partyGroupService: PartyGroupService, private personService: PersonService) {}

  public onOpenDialog(ev: any): void {
	this.creditProposalService.find('cif/' + this.searchInput).subscribe((res: HttpResponse<ICreditProposal>) => {
	  this.partyCifService.find('cif/' + this.searchInput).subscribe((res1: HttpResponse<IPartyCif>) => {
		this.partyCif = res1.body;
		  if(res1.body['customerType'] === 'CORPORATE'){
			this.responseCif = 'PARTY_GROUP';
			this.getPartyGroup(res1.body['partyId']);
		  }else{
			this.responseCif = 'PERSON';
			this.getPerson(res1.body['partyId']);
		  }
		});
    });

    this.partyCifService.find('cif/' + this.searchInput).subscribe((res: HttpResponse<IPartyCif>) => {
	  this.partyCif = res.body;
	  if(res.body['customerType'] === 'CORPORATE'){
		this.responseCif = 'PARTY_GROUP';
		this.getPartyGroup(res.body['partyId']);
	  }else{
		this.responseCif = 'PERSON';
		this.getPerson(res.body['partyId']);
	  }
    });
  }
  
  public getPartyGroup(partyId: string): void {
	this.partyGroupService.find(partyId).subscribe((res: HttpResponse<IPartyGroup>) => {
      this.partyGroup = res.body;
    });
  }

  public getPerson(partyId: string): void {
	this.personService.find(partyId).subscribe((res: HttpResponse<IPerson>) => {
      this.person = res.body;
    });
  }

  public onSelectCheckBoxCollateralChanged(ev): void {
	this.dataSelectedCheckbox = [];
	this.dataSelectedCheckbox = ev;
  }

  public save(ev: any): void {
    for (let i = 0; i < this.dataSelectedCheckbox.length; i++) {
      this.collateralAppraisal['statusId'] = 'DRAFT';
      this.collateralAppraisal['statusDescription'] = 'Draft';
      this.collateralAppraisal['applicationId'] = this.partyCif['id'];
      this.collateralAppraisal['collateralId'] = this.dataSelectedCheckbox[i]['id'];

      this.partyCif['appraisals'].push(this.collateralAppraisal);
    }

    console.log('this.partyCif : ', this.partyCif);
    console.log('this.dataSelectedCheckbox : ', this.dataSelectedCheckbox);

    this.partyCifService.save(this.partyCif).subscribe((res: HttpResponse<IPartyCif>) => {
      console.log('res.body save partyCif : ', res.body);
      this.router.navigate(['./collateral-appraisal']);
    });
  }
}
 */

import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { IPerson, Person } from '../person/person.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';

@Component({
  selector: 'jhi-appraisal-data-nasabah',
  templateUrl: './collateral-appraisal-data-nasabah.component.html',
  styleUrls: ['./collateral-appraisal-data-nasabah.css'],
})
export class CollateralAppraisalDataNasabahComponent {
  public Person: IPerson = new Person();
  public PartyGroub: IPartyGroup = new PartyGroup();

  public formContent: string;

  public responseCif: string;
  public searchInput: string;

  constructor(private creditProposalService: CreditProposalService) {}

  public onOpenDialog(ev: any): void {
    this.responseCif = 'PERSON';
    // this.creditProposalService.find('cif/' + this.searchInput).subscribe((response: HttpResponse<ICreditProposal>) => {
    //   this.responseCif = response.body[0].partyTypeId;
    //   this.Person = response.body[0].prospectPerson;
    //   this.PartyGroub = response.body[0].prospectOrganization;
    // });
  }
}
