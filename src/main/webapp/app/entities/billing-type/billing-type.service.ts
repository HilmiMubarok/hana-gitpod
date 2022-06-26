import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IBillingType } from './billing-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class BillingTypeService extends AbstractEntityService<IBillingType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/billing-types');
  }

  protected isNew(entity: IBillingType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IBillingType) {}
}
