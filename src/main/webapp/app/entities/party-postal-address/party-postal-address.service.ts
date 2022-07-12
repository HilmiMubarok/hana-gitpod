import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyPostalAddress } from './party-postal-address.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PartyPostalAddressService extends AbstractEntityService<IPartyPostalAddress> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/party-postal-addresses');
  }

  protected isNew(entity: IPartyPostalAddress): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IPartyPostalAddress>): HttpResponse<IPartyPostalAddress> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IPartyPostalAddress[]>): HttpResponse<IPartyPostalAddress[]> {
    res.body.forEach((partyPostalAddress: IPartyPostalAddress) => {
      partyPostalAddress.fromDate = partyPostalAddress.fromDate != null ? new Date(partyPostalAddress.fromDate) : null;
      partyPostalAddress.thruDate = partyPostalAddress.thruDate != null ? new Date(partyPostalAddress.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IPartyPostalAddress) {}
}
