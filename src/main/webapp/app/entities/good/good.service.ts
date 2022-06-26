import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IGood } from './good.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class GoodService extends AbstractEntityService<IGood> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/goods');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/goods');
  }

  protected isNew(entity: IGood): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IGood>): HttpResponse<IGood> {
    res.body.introDate = res.body.introDate != null ? new Date(res.body.introDate) : null;
    res.body.discontinueDate = res.body.discontinueDate != null ? new Date(res.body.discontinueDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IGood[]>): HttpResponse<IGood[]> {
    res.body.forEach((good: IGood) => {
      good.introDate = good.introDate != null ? new Date(good.introDate) : null;
      good.discontinueDate = good.discontinueDate != null ? new Date(good.discontinueDate) : null;
    });
    return res;
  }

  protected preSave(entity: IGood) {}
}
