import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyCif } from './party-cif.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PartyCifService extends AbstractEntityService<IPartyCif> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/services/los/api/party-cifs');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('/services/los/api/party-cifs');
  }

  protected isNew(entity: IPartyCif): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartyCif) {}
}
