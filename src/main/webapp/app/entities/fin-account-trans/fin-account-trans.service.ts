import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFinAccountTrans } from './fin-account-trans.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class FinAccountTransService extends AbstractEntityService<IFinAccountTrans> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/fin-account-trans');
  }

  protected isNew(entity: IFinAccountTrans): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IFinAccountTrans>): HttpResponse<IFinAccountTrans> {
    res.body.entryDate = res.body.entryDate != null ? new Date(res.body.entryDate) : null;
    res.body.postedDate = res.body.postedDate != null ? new Date(res.body.postedDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IFinAccountTrans[]>): HttpResponse<IFinAccountTrans[]> {
    res.body.forEach((finAccountTrans: IFinAccountTrans) => {
      finAccountTrans.entryDate = finAccountTrans.entryDate != null ? new Date(finAccountTrans.entryDate) : null;
      finAccountTrans.postedDate = finAccountTrans.postedDate != null ? new Date(finAccountTrans.postedDate) : null;
      const roles = finAccountTrans.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IFinAccountTrans) {}
}
