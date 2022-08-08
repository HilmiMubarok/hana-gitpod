import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IEmployee } from './employee.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends AbstractEntityService<IEmployee> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/employees');
  }

  protected isNew(entity: IEmployee): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IEmployee>): HttpResponse<IEmployee> {
    res.body.registrationDate = res.body.registrationDate != null ? new Date(res.body.registrationDate) : null;
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IEmployee[]>): HttpResponse<IEmployee[]> {
    res.body.forEach((employee: IEmployee) => {
      employee.registrationDate = employee.registrationDate != null ? new Date(employee.registrationDate) : null;
      employee.fromDate = employee.fromDate != null ? new Date(employee.fromDate) : null;
      employee.thruDate = employee.thruDate != null ? new Date(employee.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IEmployee) {}
}
