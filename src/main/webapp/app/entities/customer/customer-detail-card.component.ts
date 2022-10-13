import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';
import { IPartyGroup } from '../party-group/party-group.model';
import { PartyGroupService } from '../party-group/party-group.service';
import { IPerson } from '../person/person.model';
import { PersonService } from '../person/person.service';

@Component({
  selector: 'jhi-customer-detail-card',
  templateUrl: './customer-detail-card.component.html',
})
export class CustomerDetailCardComponent implements OnChanges {
  @Input()
  public partyId: string;

  @Input()
  public customerType: string;

  public customer: IPartyGroup | IPerson;

  constructor(private personService: PersonService, private partyGroupService: PartyGroupService) {
    this.customer = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyId'] && changes['customerType']) {
      this.loadParty(this.partyId);
    }
  }

  private loadParty(partyId: string): void {
    if (this.customerType === CustomerType.CORPORATE) {
      this.partyGroupService.find(partyId).subscribe(res => {
        this.customer = res.body;
      });
    } else if (this.customerType === CustomerType.PERSONAL) {
      this.personService.find(partyId).subscribe(res => {
        this.customer = res.body;
      });
    }
  }
}
