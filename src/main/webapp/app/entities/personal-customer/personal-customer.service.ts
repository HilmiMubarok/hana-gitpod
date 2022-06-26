import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPersonalCustomer } from './personal-customer.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PersonalCustomerService extends AbstractEntityService<IPersonalCustomer> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/personal-customers');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/personal-customers');
  }

  protected isNew(entity: IPersonalCustomer): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IPersonalCustomer>): HttpResponse<IPersonalCustomer> {
    res.body.dob = res.body.dob != null ? new Date(res.body.dob) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IPersonalCustomer[]>): HttpResponse<IPersonalCustomer[]> {
    res.body.forEach((personalCustomer: IPersonalCustomer) => {
      personalCustomer.dob = personalCustomer.dob != null ? new Date(personalCustomer.dob) : null;
    });
    return res;
  }

  protected preSave(entity: IPersonalCustomer) {}
}
