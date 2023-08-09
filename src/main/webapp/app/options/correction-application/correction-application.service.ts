import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { CorrectionApplication } from './correction-application.model';

@Injectable({ providedIn: 'root' })
export class CorrectionApplicationService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/correction-applications');
  }

  protected preSave(entity: CorrectionApplication) {
    return entity;
  }

  public create(entity: CorrectionApplication): Observable<HttpResponse<string>> {
    this.preSave(entity);
    return this.http.post<string>(this.resourceUrl, entity, { observe: 'response' });
  }
}
