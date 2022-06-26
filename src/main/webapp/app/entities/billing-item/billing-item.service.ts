import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IBillingItem } from './billing-item.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class BillingItemService extends AbstractEntityService<IBillingItem> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/billing-items');
  }

  protected isNew(entity: IBillingItem): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IBillingItem) {}
}
