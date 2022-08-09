import { Component } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { IPerson, Person } from '../person/person.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';

@Component({
  selector: 'jhi-appraisal-data-nasabah',
  templateUrl: './collateral-appraisal-data-nasabah.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalDataNasabahComponent {
  public Person: IPerson = new Person();
  public PartyGroub: IPartyGroup = new PartyGroup();

  public responseCif: string;
  public searchInput: string;

  constructor(private creditProposalService: CreditProposalService) {}

  public onOpenDialog(ev: any): void {
    this.creditProposalService.find('cif/' + this.searchInput).subscribe((response: HttpResponse<ICreditProposal>) => {
      this.responseCif = response.body[0].partyTypeId;
      this.Person = response.body[0].prospectPerson;
      this.PartyGroub = response.body[0].prospectOrganization;
    });
  }
}
