import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IStateBoundary } from './state-boundary.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class StateBoundaryService extends AbstractEntityService<IStateBoundary> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/state-boundaries');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/state-boundaries');
  }

  protected isNew(entity: IStateBoundary): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IStateBoundary) {}
}
