import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditRating } from './credit-rating.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class CreditRatingService extends AbstractEntityService<ICreditRating> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/services/los/api/credit-ratings');
  }

  protected isNew(entity: ICreditRating): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICreditRating>): HttpResponse<ICreditRating> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICreditRating[]>): HttpResponse<ICreditRating[]> {
    res.body.forEach((creditRating: ICreditRating) => {
      creditRating.fromDate = creditRating.fromDate != null ? new Date(creditRating.fromDate) : null;
      creditRating.thruDate = creditRating.thruDate != null ? new Date(creditRating.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: ICreditRating) {
    console.log('entity at preSave : ', entity);
  }
}
