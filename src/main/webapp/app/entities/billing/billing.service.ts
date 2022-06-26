import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IBilling } from './billing.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class BillingService extends AbstractEntityService<IBilling> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/billings');
  }

  protected isNew(entity: IBilling): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IBilling>): HttpResponse<IBilling> {
    res.body.dueDate = res.body.dueDate != null ? new Date(res.body.dueDate) : null;
    res.body.postedDate = res.body.postedDate != null ? new Date(res.body.postedDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IBilling[]>): HttpResponse<IBilling[]> {
    res.body.forEach((billing: IBilling) => {
      billing.dueDate = billing.dueDate != null ? new Date(billing.dueDate) : null;
      billing.postedDate = billing.postedDate != null ? new Date(billing.postedDate) : null;
      const roles = billing.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IBilling) {}
}
