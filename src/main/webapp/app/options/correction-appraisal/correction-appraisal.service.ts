import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { CorrectionAppraisal } from './correction-appraisal.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CorrectionAppraisalService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/correction-appraisals');
  }

  protected preSave(entity: CorrectionAppraisal) {
    return entity;
  }

  public create(entity: CorrectionAppraisal): Observable<HttpResponse<string>> {
    this.preSave(entity);
    return this.http.post<string>(this.resourceUrl, entity, { observe: 'response' });
  }
}
