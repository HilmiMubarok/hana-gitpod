import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFeatureType } from './feature-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class FeatureTypeService extends AbstractEntityService<IFeatureType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/feature-types');
  }

  protected isNew(entity: IFeatureType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IFeatureType) {}
}
