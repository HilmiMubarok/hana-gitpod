import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPartyPostalAddress } from './party-postal-address.model';
import { PartyPostalAddressService } from './party-postal-address.service';

@Component({
  selector: 'jhi-party-postal-addres-card',
  templateUrl: './party-postal-address-card.component.html',
})
export class PartyPostalAddressCardComponent implements OnChanges {
  @Input()
  public partyId: string;

  public partyPostalAddresses: IPartyPostalAddress[];
  constructor(private partyPostalAddressService: PartyPostalAddressService) {
    this.partyPostalAddresses = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyId']) {
      this.loadAll(this.partyId);
    }
  }

  private loadAll(partyId: string) {
    this.partyPostalAddressService.queryFilterBy({ idParty: partyId, page: 0, size: 9999 }).subscribe(res => {
      this.partyPostalAddresses = res.body;
    });
  }
}
