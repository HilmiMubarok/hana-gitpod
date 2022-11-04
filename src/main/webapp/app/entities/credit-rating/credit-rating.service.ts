import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditRating } from './credit-rating.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreditRatingService extends AbstractEntityService<ICreditRating> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/credit-ratings');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/party-cifs');
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

  // sysccreditReting
  public creditRetingSync(cif: string): Observable<HttpResponse<ICreditRating>> {
    return this.http.get<ICreditRating>(this.resourceUrlNew + '/cif/find-credit-rating/' + cif, { observe: 'response' });
  }

  protected preSave(entity: ICreditRating) {
    console.log('entity at preSave : ', entity);
  }
}
