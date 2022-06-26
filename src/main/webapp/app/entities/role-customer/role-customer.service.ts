import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRoleCustomer } from './role-customer.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class RoleCustomerService extends AbstractEntityService<IRoleCustomer> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/role-customers');
  }

  protected isNew(entity: IRoleCustomer): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IRoleCustomer>): HttpResponse<IRoleCustomer> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IRoleCustomer[]>): HttpResponse<IRoleCustomer[]> {
    res.body.forEach((roleCustomer: IRoleCustomer) => {
      roleCustomer.fromDate = roleCustomer.fromDate != null ? new Date(roleCustomer.fromDate) : null;
      roleCustomer.thruDate = roleCustomer.thruDate != null ? new Date(roleCustomer.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IRoleCustomer) {}
}
