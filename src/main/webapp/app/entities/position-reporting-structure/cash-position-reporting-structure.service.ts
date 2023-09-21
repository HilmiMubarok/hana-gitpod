import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { IPositionReportingStructure } from './position-reporting-structure.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CashPositionReportingStructureService {
  private resourceUrl: string;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(
      MICROSERVICENAME.MASTERCONTROL + '/api/cash-position-reporting-structure'
    );
  }

  public bulkData(entity: IPositionReportingStructure[], params?: any): Observable<HttpResponse<string>> {
    const options = createRequestOption(params);
    return this.http.post<string>(`${this.resourceUrl}/bulk`, entity, {
      observe: 'response',
      params: options,
    });
  }
}
