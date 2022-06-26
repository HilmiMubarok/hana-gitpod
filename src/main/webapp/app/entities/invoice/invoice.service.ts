import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IInvoice } from './invoice.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class InvoiceService extends AbstractEntityService<IInvoice> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/invoices');
  }

  protected isNew(entity: IInvoice): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IInvoice>): HttpResponse<IInvoice> {
    res.body.dueDate = res.body.dueDate != null ? new Date(res.body.dueDate) : null;
    res.body.postedDate = res.body.postedDate != null ? new Date(res.body.postedDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IInvoice[]>): HttpResponse<IInvoice[]> {
    res.body.forEach((invoice: IInvoice) => {
      invoice.dueDate = invoice.dueDate != null ? new Date(invoice.dueDate) : null;
      invoice.postedDate = invoice.postedDate != null ? new Date(invoice.postedDate) : null;
      const roles = invoice.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IInvoice) {}
}
