import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { MasterDocumentTerm, SchedulerType } from './master-document-term.model';

@Injectable({
  providedIn: 'root',
})
export class MasterDocumentTermService extends AbstractEntityService<MasterDocumentTerm> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/schedulers');
  }

  getMasterDocumentTerm(): Observable<HttpResponse<MasterDocumentTerm>> {
    return this.http.get(this.resourceUrl + '/category/TBO_LEGAL_MONITORING', { observe: 'response' });
  }

  getSchedulerType(): Observable<HttpResponse<SchedulerType>> {
    return this.http.get(this.resourceUrl + '/intervals', { observe: 'response' });
  }

  updateMasterDocumentTerm(data: MasterDocumentTerm): Observable<HttpResponse<MasterDocumentTerm>> {
    return this.http.put(this.resourceUrl + '/', data, { observe: 'response' });
  }
}
