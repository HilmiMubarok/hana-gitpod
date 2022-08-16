import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IProcessTask } from 'app/shared/model/process-task.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CollateralAppraisalProcessService {
  public resourceUrl: string;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/collateral-appraisal-process');
  }

  public getTasks(id: number): Observable<HttpResponse<IProcessTask[]>> {
    return this.http.get<IProcessTask[]>(this.resourceUrl + '/' + id, { observe: 'response' });
  }
}
