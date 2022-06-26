import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IGLResourceType } from './gl-resource-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class GLResourceTypeService extends AbstractEntityService<IGLResourceType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/gl-resource-types');
  }

  protected isNew(entity: IGLResourceType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IGLResourceType) {}
}
