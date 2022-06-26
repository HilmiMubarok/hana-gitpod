import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyCategory } from './party-category.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PartyCategoryService extends AbstractEntityService<IPartyCategory> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/party-categories');
  }

  protected isNew(entity: IPartyCategory): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartyCategory) {}
}
