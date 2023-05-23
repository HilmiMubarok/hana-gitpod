import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IComplianceChecklistCriteria } from './compliance-checklist-criteria.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Injectable } from '@angular/core';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({
  providedIn: 'root',
})
export class ComplianceChecklistCriteriaService extends AbstractEntityService<IComplianceChecklistCriteria> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/compliance-checklist-parameters');
  }

  public filterTableData(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrl + '/filterBy?', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
}
