import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICollateralProperty } from './collateral-property.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class CollateralPropertyService extends AbstractEntityService<ICollateralProperty> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/collateral-properties');
  }

  protected isNew(entity: ICollateralProperty): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: ICollateralProperty) {}
}
