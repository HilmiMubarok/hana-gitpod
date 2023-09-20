import { Injectable } from '@angular/core';
import { IEmployee } from './employee.model';
import { createRequestOption } from 'app/core/request/request-util';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({
  providedIn: 'root',
})
export class CashEmployeeService {
  private resourceUrl: string;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/cash-employees');
  }

  public bulkData(entity: IEmployee[], params?: any): Observable<HttpResponse<string>> {
    const options = createRequestOption(params);
    return this.http.post<string>(`${this.resourceUrl}/bulk`, entity, {
      observe: 'response',
      params: options,
    });
  }
}
