import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IChartData } from './dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends AbstractEntityService<IChartData> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/credit-proposals');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/dashboards/collateral-appraisals');
  }

  public creditProposals(): {
    getGroupByStatus: (req: any) => Observable<HttpResponse<any>>;
    getDueDate: (req: any) => Observable<HttpResponse<any>>;
    getSummaryStatus: (req: any) => Observable<HttpResponse<any>>;
    getProgress: (req: any) => Observable<HttpResponse<any>>;
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
    getGroupByStatus: (req: any) => Observable<HttpResponse<any>>;
    getDueDate: (req: any) => Observable<HttpResponse<any>>;
    getSummaryStatus: (req: any) => Observable<HttpResponse<any>>;
    getProgress: (req: any) => Observable<HttpResponse<any>>;
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

  //   public filterBy(req?: any): Observable<HttpResponse<IMenuAccess[]>> {
  //     const opt = createRequestOption(req);
  //     return this.http.get<IMenuAccess[]>(`${this.resourceUrl}/filterBy`, { observe: 'response', params: opt });
  //   }
}
