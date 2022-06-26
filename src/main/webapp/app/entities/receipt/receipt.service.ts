import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IReceipt } from './receipt.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class ReceiptService extends AbstractEntityService<IReceipt> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/receipts');
  }

  protected isNew(entity: IReceipt): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IReceipt>): HttpResponse<IReceipt> {
    res.body.transactionDate = res.body.transactionDate != null ? new Date(res.body.transactionDate) : null;
    res.body.postedDate = res.body.postedDate != null ? new Date(res.body.postedDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IReceipt[]>): HttpResponse<IReceipt[]> {
    res.body.forEach((receipt: IReceipt) => {
      receipt.transactionDate = receipt.transactionDate != null ? new Date(receipt.transactionDate) : null;
      receipt.postedDate = receipt.postedDate != null ? new Date(receipt.postedDate) : null;
      const roles = receipt.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IReceipt) {}
}
