import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { ICustomer } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends AbstractEntityService<ICustomer> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/customers');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/_search/customers');
  }
}
