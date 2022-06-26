import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IBillingItemType } from './billing-item-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class BillingItemTypeService extends AbstractEntityService<IBillingItemType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/billing-item-types');
  }

  protected isNew(entity: IBillingItemType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IBillingItemType) {}
}
