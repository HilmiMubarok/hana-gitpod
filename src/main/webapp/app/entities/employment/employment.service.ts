import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Employment, IEmployment } from './employment.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmploymentService extends AbstractEntityService<IEmployment> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/employments');
  }

  protected isNew(entity: IEmployment): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IEmployment>): HttpResponse<IEmployment> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IEmployment[]>): HttpResponse<IEmployment[]> {
    res.body.forEach((employment: IEmployment) => {
      employment.fromDate = employment.fromDate != null ? new Date(employment.fromDate) : null;
      employment.thruDate = employment.thruDate != null ? new Date(employment.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IEmployment) {}

  private employmentUrl = 'https://services/mastercontrol/api/work-types'; // URL to web api

  getEmployment(): Observable<Employment[]> {
    return this.http.get<Employment[]>(this.employmentUrl);
  }
}
