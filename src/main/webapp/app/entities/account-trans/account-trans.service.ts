import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAccountTrans } from './account-trans.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class AccountTransService extends AbstractEntityService<IAccountTrans> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/account-trans');
  }

  protected isNew(entity: IAccountTrans): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IAccountTrans>): HttpResponse<IAccountTrans> {
    res.body.entryDate = res.body.entryDate != null ? new Date(res.body.entryDate) : null;
    res.body.postedDate = res.body.postedDate != null ? new Date(res.body.postedDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IAccountTrans[]>): HttpResponse<IAccountTrans[]> {
    res.body.forEach((accountTrans: IAccountTrans) => {
      accountTrans.entryDate = accountTrans.entryDate != null ? new Date(accountTrans.entryDate) : null;
      accountTrans.postedDate = accountTrans.postedDate != null ? new Date(accountTrans.postedDate) : null;
      const roles = accountTrans.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IAccountTrans) {}
}
