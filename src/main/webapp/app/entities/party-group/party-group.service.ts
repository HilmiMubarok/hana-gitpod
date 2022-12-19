import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyGroup } from './party-group.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class PartyGroupService extends AbstractEntityService<IPartyGroup> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/party-groups');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/party-groups');
  }

  protected isNew(entity: IPartyGroup): boolean {
    return entity.id === undefined || entity.id === null;
  }

  preSave(entity: IPartyGroup) {
    this.http.post<IPartyGroup[]>(this.resourceUrl, entity).subscribe(response => alert('success'));
  }
}
