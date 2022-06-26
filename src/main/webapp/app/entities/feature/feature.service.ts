import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFeature } from './feature.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class FeatureService extends AbstractEntityService<IFeature> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/features');
  }

  protected isNew(entity: IFeature): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IFeature) {}
}
