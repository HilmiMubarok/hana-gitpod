import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFinancingRequest } from './financing-request.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class FinancingRequestService extends AbstractEntityService<IFinancingRequest> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/financing-requests');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/financing-requests');
  }

  protected isNew(entity: IFinancingRequest): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IFinancingRequest>): HttpResponse<IFinancingRequest> {
    res.body.dueDate = res.body.dueDate != null ? new Date(res.body.dueDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IFinancingRequest[]>): HttpResponse<IFinancingRequest[]> {
    res.body.forEach((financingRequest: IFinancingRequest) => {
      financingRequest.dueDate = financingRequest.dueDate != null ? new Date(financingRequest.dueDate) : null;
      const roles = financingRequest.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IFinancingRequest) {}
}
