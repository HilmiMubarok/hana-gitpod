import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISettlement } from './settlement.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class SettlementService extends AbstractEntityService<ISettlement> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/settlements');
  }

  protected isNew(entity: ISettlement): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ISettlement>): HttpResponse<ISettlement> {
    res.body.dateDue = res.body.dateDue != null ? new Date(res.body.dateDue) : null;
    res.body.datePaid = res.body.datePaid != null ? new Date(res.body.datePaid) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ISettlement[]>): HttpResponse<ISettlement[]> {
    res.body.forEach((settlement: ISettlement) => {
      settlement.dateDue = settlement.dateDue != null ? new Date(settlement.dateDue) : null;
      settlement.datePaid = settlement.datePaid != null ? new Date(settlement.datePaid) : null;
      const roles = settlement.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: ISettlement) {}
}
