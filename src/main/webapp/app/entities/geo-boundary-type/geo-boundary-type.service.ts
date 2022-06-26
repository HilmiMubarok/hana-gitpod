import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IGeoBoundaryType } from './geo-boundary-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class GeoBoundaryTypeService extends AbstractEntityService<IGeoBoundaryType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/geo-boundary-types');
  }

  protected isNew(entity: IGeoBoundaryType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IGeoBoundaryType) {}
}
