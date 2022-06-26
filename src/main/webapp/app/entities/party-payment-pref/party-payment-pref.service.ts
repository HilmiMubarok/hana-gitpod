import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyPaymentPref } from './party-payment-pref.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PartyPaymentPrefService extends AbstractEntityService<IPartyPaymentPref> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/party-payment-prefs');
  }

  protected isNew(entity: IPartyPaymentPref): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartyPaymentPref) {}
}
