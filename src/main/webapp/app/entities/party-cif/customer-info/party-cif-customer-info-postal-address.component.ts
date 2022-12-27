import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPartyPostalAddress, PartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IStateBoundary, StateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';

@Component({
  selector: 'jhi-party-cif-customer-info-postal-address',
  templateUrl: './party-cif-customer-info-postal-address.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoPostalAddressComponent extends AbstractEntityViewPageComponent<IPartyPostalAddress>
{
  private _partyPostalAddresses = new PartyPostalAddress();

  @Input()
  public disabled: Boolean = false;

  @Input()
  get partyPostalAddress() {
    return this._partyPostalAddresses;
  }

  set partyPostalAddress(data: IPartyPostalAddress) {
    this._partyPostalAddresses = data;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    private stateBoundaryService: StateBoundaryService
  ) {
    super();
  }

  public findStateBoundary(id: number, param: IStateBoundary[]): IStateBoundary {
    if (param.length > 0) {
      for (let i = 0; i < param.length; i++) {
        const item: IStateBoundary = param[i];
        if (item.id === id) {
          return item;
        }
      }
    }
    return new StateBoundary();
  }
}
