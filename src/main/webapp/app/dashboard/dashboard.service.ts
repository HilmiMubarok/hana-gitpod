import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IChartData, IGroupByStatus, IInterval } from './dashboard.model';
import { IDueDate } from './charts/bar-chart/bar-chart.model';
import { IProgress } from './charts/line-chart/line-chart.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends AbstractEntityService<IChartData> {
  public resourceUrlNewNew: any;
  public resourceUrlInteral: any;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrlNewNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards');
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposals');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/collateral-appraisals');
    this.resourceUrlInteral = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/internals');
  }

  public creditProposals(): {
    getGroupByStatus: (req: any) => Observable<HttpResponse<IGroupByStatus[]>>;
    getDueDate: (req: any) => Observable<HttpResponse<IDueDate[]>>;
    getSummaryStatus: (req: any) => Observable<HttpResponse<IGroupByStatus[]>>;
    getProgress: (req: any) => Observable<HttpResponse<IProgress[]>>;
  } {
    return {
      getGroupByStatus: (param): Observable<HttpResponse<any>> => {
        const options = createRequestOption(param);
        return this.http.get<any[]>(`${this.resourceUrl}/group-by-status`, { observe: 'response', params: options });
      },
      getDueDate: (param): Observable<HttpResponse<any>> => {
        const options = createRequestOption(param);
        return this.http.get<any[]>(`${this.resourceUrl}/due-date`, { observe: 'response', params: options });
      },
      getSummaryStatus: (param): Observable<HttpResponse<any>> => {
        const options = createRequestOption(param);
        return this.http.get<any[]>(`${this.resourceUrl}/summary-status`, { observe: 'response', params: options });
      },
      getProgress: (param): Observable<HttpResponse<any>> => {
        const options = createRequestOption(param);
        return this.http.get<any[]>(`${this.resourceUrl}/progress`, { observe: 'response', params: options });
      },
    };
  }

  public appraisal(): {
    getGroupByStatus: (req: any) => Observable<HttpResponse<IGroupByStatus[]>>;
    getDueDate: (req: any) => Observable<HttpResponse<IDueDate[]>>;
    getSummaryStatus: (req: any) => Observable<HttpResponse<IGroupByStatus[]>>;
    getProgress: (req: any) => Observable<HttpResponse<IProgress[]>>;
  } {
    return {
      getGroupByStatus: (param): Observable<HttpResponse<any>> => {
        const options = createRequestOption(param);
        return this.http.get<any[]>(`${this.resourceUrlNew}/group-by-status`, { observe: 'response', params: options });
      },
      getDueDate: (param): Observable<HttpResponse<any>> => {
        const options = createRequestOption(param);
        return this.http.get<any[]>(`${this.resourceUrlNew}/due-date`, { observe: 'response', params: options });
      },
      getSummaryStatus: (param): Observable<HttpResponse<any>> => {
        const options = createRequestOption(param);
        return this.http.get<any[]>(`${this.resourceUrlNew}/summary-status`, { observe: 'response', params: options });
      },
      getProgress: (param): Observable<HttpResponse<any>> => {
        const options = createRequestOption(param);
        return this.http.get<any[]>(`${this.resourceUrlNew}/progress`, { observe: 'response', params: options });
      },
    };
  }

  public getSegment(param): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(param);
    return this.http.get<any[]>(`${this.resourceUrlInteral}`, { observe: 'response', params: options });
  }

  public getInterval(): Observable<HttpResponse<IInterval[]>> {
    return this.http.get<any[]>(`${this.resourceUrlNewNew}/intervals`, { observe: 'response' });
  }

  //   public filterBy(req?: any): Observable<HttpResponse<IMenuAccess[]>> {
  //     const opt = createRequestOption(req);
  //     return this.http.get<IMenuAccess[]>(`${this.resourceUrl}/filterBy`, { observe: 'response', params: opt });
  //   }
}
