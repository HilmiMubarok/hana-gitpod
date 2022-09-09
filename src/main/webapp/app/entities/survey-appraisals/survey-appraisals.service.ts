import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISurveyAppraisals } from './survey-appraisals.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SurveyAppraisalsService extends AbstractEntityService<ISurveyAppraisals> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/survey-appraisals');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/_search/survey-appraisals');
  }

  /* protected isNew(entity: ISurveyAppraisals): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ISurveyAppraisals>): HttpResponse<ISurveyAppraisals> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ISurveyAppraisals[]>): HttpResponse<ISurveyAppraisals[]> {
    res.body.forEach((surveyAppraisal: ISurveyAppraisals) => {
      surveyAppraisal.fromDate = surveyAppraisal.fromDate != null ? new Date(surveyAppraisal.fromDate) : null;
      surveyAppraisal.thruDate = surveyAppraisal.thruDate != null ? new Date(surveyAppraisal.thruDate) : null;
    });
    return res;
  }*/

  public customGet(param: any): Observable<HttpResponse<any>> {
    return this.http
      .get<any>(`${this.resourceUrl}/${param}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
  }

  protected preSave(entity: ISurveyAppraisals) {}
}