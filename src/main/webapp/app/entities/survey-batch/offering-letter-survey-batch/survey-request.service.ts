import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISurveyBatch } from '../survey-batch.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { ISurveyRequest } from './survey-request.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SurveyRequestService extends AbstractEntityService<ISurveyRequest> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/survey-requests');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/survey-requests');
  }

  protected isNew(entity: ISurveyRequest): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ISurveyRequest>): HttpResponse<ISurveyRequest> {
    res.body.requestDate = res.body.requestDate != null ? new Date(res.body.requestDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ISurveyRequest[]>): HttpResponse<ISurveyRequest[]> {
    res.body.forEach((SurveyRequest: ISurveyRequest) => {
      SurveyRequest.requestDate = SurveyRequest.requestDate != null ? new Date(SurveyRequest.requestDate) : null;
    });
    return res;
  }

  createAggregate(entity, params?: any): Observable<HttpResponse<any>> {
    this.preSave(entity);
    const options = createRequestOption(params);
    return this.http
      .post<any>(this.resourceUrl + '/aggregate', entity, { observe: 'response', params: options })
      .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
  }

  getAggregate(id: any): Observable<HttpResponse<ISurveyRequest>> {
    return this.http.get<ISurveyRequest>(`${this.resourceUrl}/aggregate/${id}`, { observe: 'response' });
  }

  protected preSave(entity: ISurveyRequest) {}
}
