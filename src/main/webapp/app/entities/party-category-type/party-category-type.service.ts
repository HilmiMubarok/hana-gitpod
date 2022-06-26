import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyCategoryType } from './party-category-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PartyCategoryTypeService extends AbstractEntityService<IPartyCategoryType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/party-category-types');
  }

  protected isNew(entity: IPartyCategoryType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartyCategoryType) {}
}
