import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppraisalRoleProcessService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = MICROSERVICENAME.LOS + '/appraisal-role-process';
  }

  public unAssignRoleRM(idAppraisal: number, content: object): Observable<HttpResponse<object[]>> {
    return this.http.post<object[]>(`${this.resourceUrl}/unassign-role-rm/${idAppraisal}`, content, { observe: 'response' });
  }
}
