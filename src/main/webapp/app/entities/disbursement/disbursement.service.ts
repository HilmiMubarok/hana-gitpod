import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IDisbursement } from './disbursement.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class DisbursementService extends AbstractEntityService<IDisbursement> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/disbursements');
  }

  protected isNew(entity: IDisbursement): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IDisbursement>): HttpResponse<IDisbursement> {
    res.body.transactionDate = res.body.transactionDate != null ? new Date(res.body.transactionDate) : null;
    res.body.postedDate = res.body.postedDate != null ? new Date(res.body.postedDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IDisbursement[]>): HttpResponse<IDisbursement[]> {
    res.body.forEach((disbursement: IDisbursement) => {
      disbursement.transactionDate = disbursement.transactionDate != null ? new Date(disbursement.transactionDate) : null;
      disbursement.postedDate = disbursement.postedDate != null ? new Date(disbursement.postedDate) : null;
      const roles = disbursement.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IDisbursement) {}
}
