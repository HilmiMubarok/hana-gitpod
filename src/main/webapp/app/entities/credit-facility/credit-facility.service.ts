import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditFacility } from './credit-facility.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class CreditFacilityService extends AbstractEntityService<ICreditFacility> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-facilities');
  }

  protected isNew(entity: ICreditFacility): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICreditFacility>): HttpResponse<ICreditFacility> {
    res.body.introDate = res.body.introDate != null ? new Date(res.body.introDate) : null;
    res.body.discontinueDate = res.body.discontinueDate != null ? new Date(res.body.discontinueDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICreditFacility[]>): HttpResponse<ICreditFacility[]> {
    res.body.forEach((creditFacility: ICreditFacility) => {
      creditFacility.introDate = creditFacility.introDate != null ? new Date(creditFacility.introDate) : null;
      creditFacility.discontinueDate = creditFacility.discontinueDate != null ? new Date(creditFacility.discontinueDate) : null;
    });
    return res;
  }

  protected preSave(entity: ICreditFacility) {}
}
