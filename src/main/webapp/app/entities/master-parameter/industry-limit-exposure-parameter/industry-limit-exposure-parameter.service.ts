import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IIndustryLimitExposureParameter } from './industry-limit-exposure-parameter.model';
import { Observable, map } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({
  providedIn: 'root',
})
export class IndustryLimitExposureParameterService extends AbstractEntityService<IIndustryLimitExposureParameter> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/industry-limit-exposure-parameter');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(
      MICROSERVICENAME.LOS + '/api/industry-limit-exposure-parameter/search'
    );
  }

  public bulkUpdate(entity: IIndustryLimitExposureParameter[], params?: any): Observable<HttpResponse<string>> {
    const options = createRequestOption(params);
    return this.http.put<string>(`${this.resourceUrl}/bulk`, entity, { observe: 'response', params: options });
  }
  public industriSrc(req?: any): Observable<HttpResponse<IIndustryLimitExposureParameter[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }
}
