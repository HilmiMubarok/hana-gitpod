import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartySlik } from './party-slik.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PartySlikService extends AbstractEntityService<IPartySlik> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/party-sliks');
  }

  protected isNew(entity: IPartySlik): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartySlik) {}
}
