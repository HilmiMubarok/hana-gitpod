import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICommEvent } from './comm-event.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class CommEventService extends AbstractEntityService<ICommEvent> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/comm-events');
  }

  protected isNew(entity: ICommEvent): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICommEvent>): HttpResponse<ICommEvent> {
    res.body.startDate = res.body.startDate != null ? new Date(res.body.startDate) : null;
    res.body.endDate = res.body.endDate != null ? new Date(res.body.endDate) : null;
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICommEvent[]>): HttpResponse<ICommEvent[]> {
    res.body.forEach((commEvent: ICommEvent) => {
      commEvent.startDate = commEvent.startDate != null ? new Date(commEvent.startDate) : null;
      commEvent.endDate = commEvent.endDate != null ? new Date(commEvent.endDate) : null;
      const roles = commEvent.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: ICommEvent) {}
}
