import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreditProposalProcessService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/credit-proposals-process');
  }

  public getTasks(id: any): Observable<HttpResponse<IProcessTask[]>> {
    return this.http.get<IProcessTask[]>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  public processTask(task: IProcessTask): Observable<HttpResponse<object>> {
    return this.http.post<object>(`${this.resourceUrl}`, task, { observe: 'response' });
  }
}
