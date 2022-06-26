import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IGeoBoundary } from './geo-boundary.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class GeoBoundaryService extends AbstractEntityService<IGeoBoundary> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/geo-boundaries');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/geo-boundaries');
  }

  protected isNew(entity: IGeoBoundary): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IGeoBoundary) {}
}
