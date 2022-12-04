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
  } */

  protected convertDateArrayFromServer(res: HttpResponse<ISurveyAppraisals[]>): HttpResponse<ISurveyAppraisals[]> {
    res.body.forEach((surveyAppraisal: ISurveyAppraisals) => {
      surveyAppraisal.fromDate = surveyAppraisal.fromDate != null ? new Date(surveyAppraisal.fromDate) : null;
      surveyAppraisal.thruDate = surveyAppraisal.thruDate != null ? new Date(surveyAppraisal.thruDate) : null;
    });
    return res;
  }

  public queryUrlRequestAppraisal(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/request-appraisals', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public queryUrlAppraisalInternal(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/distribution-internal', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public queryUrlAppraisalExternal(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/distribution-external', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public queryUrlAppraisalProcess(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/appraisal-process', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public queryUrlReportApproval(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/appraisal-report-approval', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }
  public queryUrlReportInquiry(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/appraisal-inquiry', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public customGet(param: any): Observable<HttpResponse<any>> {
    return this.http
      .get<any>(`${this.resourceUrl}/${param}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
  }

  public getBySurveyor(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any>(MICROSERVICENAME.LOS + '/api/survey-appraisals-mobile', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
  }

  public getBySurveyorByStatus(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals-mobile', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }

  public searchBySurveyor(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/_search/survey-appraisals/by-surveyor', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }

  public filterBySurveyor(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/filterByForSurveyor', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }

  protected preSave(entity: ISurveyAppraisals) {}
}
