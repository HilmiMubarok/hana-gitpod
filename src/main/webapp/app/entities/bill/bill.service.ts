import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IBill } from './bill.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class BillService extends AbstractEntityService<IBill> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/bills');
  }

  protected isNew(entity: IBill): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IBill>): HttpResponse<IBill> {
    res.body.dueDate = res.body.dueDate != null ? new Date(res.body.dueDate) : null;
    res.body.postedDate = res.body.postedDate != null ? new Date(res.body.postedDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IBill[]>): HttpResponse<IBill[]> {
    res.body.forEach((bill: IBill) => {
      bill.dueDate = bill.dueDate != null ? new Date(bill.dueDate) : null;
      bill.postedDate = bill.postedDate != null ? new Date(bill.postedDate) : null;
      const roles = bill.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IBill) {}
}
