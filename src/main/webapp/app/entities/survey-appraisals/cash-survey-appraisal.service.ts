import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISurveyAppraisals } from './survey-appraisals.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDelegationAppraisalRequest } from '../employee/delegationApplicationRequest.model';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';

@Injectable({ providedIn: 'root' })
export class CashSurveyAppraisalsService extends AbstractEntityService<ISurveyAppraisals> {
  public applicationRoleIdDH: any[];
  public applicationRoleIdTL: any[];
  public applicationRoleIdUH: any[];
  public applicationRoleIdDeptHead: any[];
  private resourceUrlCashSurveyAppraisal: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.applicationRoleIdDH = ['false'];
    this.applicationRoleIdTL = ['false'];
    this.applicationRoleIdUH = ['false'];
    this.applicationRoleIdDeptHead = ['false'];
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/_search/cash-survey-appraisals');
    this.resourceUrlCashSurveyAppraisal = `${this.resourceUrl}/cash-survey-appraisals`;
  }

  /* protected isNew(entity: ISurveyAppraisals): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ISurveyAppraisals>): HttpResponse<ISurveyAppraisals> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  } */

  public getIncorrectData(req?: any): Observable<HttpResponse<ICollateralAppraisal[]>> {
    const options = createRequestOption(req);
    return this.http.get<ICollateralAppraisal[]>(this.resourceUrlCashSurveyAppraisal + '/incorrect-data', {
      params: options,
      observe: 'response',
    });
  }

  public cashSurveyAppraisalQueryFilterBy(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(this.resourceUrl + '/cash-survey-appraisals', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  queryListOfViewStatusFilterBy(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrl + '/app-menu-status-item/filterBy', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  public cashSurveyAppraisalQueryFilterByInquiry(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(this.resourceUrl + '/cash-survey-appraisals/appraisal-inquiry', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public addDelegation(entity: ISurveyAppraisals, params?: any): Observable<HttpResponse<IDelegationAppraisalRequest>> {
    this.preSave(entity);
    const options = createRequestOption(params);
    return this.http
      .post<ISurveyAppraisals>(this.resourceUrl + '/delegation-appraisal', entity, { observe: 'response', params: options })
      .pipe(map((res: HttpResponse<ISurveyAppraisals>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals>) => this.preLoadItem(res)));
  }

  public getMyAppraisal(idParty: string, idPositionType: string, req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(
        this.resourceUrl + '/cash-survey-appraisals/my-appraisals/' + idParty + '/position-type/' + idPositionType,
        { params: options, observe: 'response' }
      )
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public cashSurveyAppraisalQueryFilterByExternal(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(this.resourceUrl + '/cash-survey-appraisals/external', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  queryDelegationAppraisalFilterBy(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(this.resourceUrl + '/delegation-appraisal/filterBy', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public cashSurveyAppraisalQueryFilterByInternal(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(this.resourceUrl + '/cash-survey-appraisals/distribution-internal', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public cashSurveyAppraisalQueryFilterByProsses(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(this.resourceUrl + '/cash-survey-appraisals-mobile', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

  public cashSurveyAppraisalQueryFilterByApproval(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(this.resourceUrl + '/cash-survey-appraisals/appraisal-report-approval', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ISurveyAppraisals[]>) => this.preLoadItemArray(res)));
  }

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

  public queryUrlAppraisalExternalNew(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/request-appraisals/external', {
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

  public searchAppraisal(req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ISurveyAppraisals[]>(this.resourceUrl + '/_search/cash-survey-appraisals', { params: options, observe: 'response' })
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
  public searchExternal(req?: any, cif?: string): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/distribution-external/filter-cif/' + cif, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
  public searchCifDistributionExternalNoBatch(cif?: any, req?: any): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/distribution-external-non-batch/filter-cif/' + cif, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
  public searchReqExternal(req?: any, cif?: string): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/request-appraisals/external/filter-cif/' + cif, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
  public searchInternal(req?: any, cif?: string): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/distribution-internal/filter-cif/' + cif, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
  public searchProcess(req?: any, cif?: string): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/appraisal-process/filter-cif/' + cif, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
  public searchInquiry(req?: any, cif?: string): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/appraisal-inquiry/filter-cif/' + cif, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
  public searchReport(req?: any, cif?: string): Observable<HttpResponse<ISurveyAppraisals[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/survey-appraisals/appraisal-report-approval/filter-cif/' + cif, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
  public searchNew(req?: any, src?: string): Observable<HttpResponse<any>> {
    console.log('req', req);
    const options = createRequestOption(req);
    console.log('options', options);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + '/api/_search/survey-appraisals/officer-type/' + src, { params: options, observe: 'response' })
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

  public getTaskDiagram(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.resourceUrl}/cash-survey-appraisals/diagram-task/${id}`, { observe: 'response', responseType: 'blob' });
  }

  public getTaskDiagramTbo(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.resourceUrl}/credit-proposal-tbo-process/diagram-task/${id}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  protected preSave(entity: ISurveyAppraisals) {}
}
