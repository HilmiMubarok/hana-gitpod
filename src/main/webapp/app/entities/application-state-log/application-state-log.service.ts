import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IApplicationStateLog } from './application-state-log.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationStateLogService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/application-state-log');
  }

  public findByBusinessKeyAndRefKey(businessKey: string, refKey: number, req: any = {}): Observable<HttpResponse<IApplicationStateLog[]>> {
    return this.http.get<IApplicationStateLog[]>(`${this.resourceUrl}/${refKey}/${businessKey}`, { observe: 'response' });
  }
}
