import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyIdentification } from './party-identification.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PartyIdentificationService extends AbstractEntityService<IPartyIdentification> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/party-identifications');
  }

  protected isNew(entity: IPartyIdentification): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartyIdentification) {}
}
