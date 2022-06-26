import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IBillingItemTypeMap } from './billing-item-type-map.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class BillingItemTypeMapService extends AbstractEntityService<IBillingItemTypeMap> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/billing-item-type-maps');
  }

  protected isNew(entity: IBillingItemTypeMap): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IBillingItemTypeMap) {}
}
