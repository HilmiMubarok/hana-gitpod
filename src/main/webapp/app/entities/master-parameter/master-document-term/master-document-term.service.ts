import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { MasterDocumentTerm, SchedulerParticipant, SchedulerType } from './master-document-term.model';

@Injectable({
  providedIn: 'root',
})
export class MasterDocumentTermService extends AbstractEntityService<MasterDocumentTerm> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/schedulers');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/scheduler-participants');
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

  getParticipantBySchedule(scheduleId: string): Observable<HttpResponse<SchedulerParticipant>> {
    return this.http.get<SchedulerParticipant>(this.resourceUrlNew + '/schedule/' + scheduleId, { observe: 'response' });
  }

  saveParticipant(data: SchedulerParticipant): Observable<HttpResponse<SchedulerParticipant>> {
    return this.http.post<SchedulerParticipant>(this.resourceUrlNew, data, { observe: 'response' });
  }

  deleteParticipant(id: number): Observable<HttpResponse<any>> {
    return this.http.delete(this.resourceUrlNew + '/' + id, { observe: 'response' });
  }

  getMasterDocumentTerms(): Observable<HttpResponse<MasterDocumentTerm[]>> {
    return this.http.get<MasterDocumentTerm[]>(this.resourceUrl + '/category/TBO_LEGAL_MONITORING', { observe: 'response' });
  }
}
