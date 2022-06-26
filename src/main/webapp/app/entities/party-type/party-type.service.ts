import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyType } from './party-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PartyTypeService extends AbstractEntityService<IPartyType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/party-types');
  }

  protected isNew(entity: IPartyType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartyType) {}
}
