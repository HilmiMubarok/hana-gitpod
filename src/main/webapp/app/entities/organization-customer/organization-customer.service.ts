import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IOrganizationCustomer } from './organization-customer.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class OrganizationCustomerService extends AbstractEntityService<IOrganizationCustomer> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/organization-customers');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/organization-customers');
  }

  protected isNew(entity: IOrganizationCustomer): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IOrganizationCustomer) {}
}
