import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IApplicationRole } from './application-role.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ApplicationRoleService extends AbstractEntityService<IApplicationRole> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/services/los/api/application-roles');
  }

  protected isNew(entity: IApplicationRole): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IApplicationRole>): HttpResponse<IApplicationRole> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IApplicationRole[]>): HttpResponse<IApplicationRole[]> {
    res.body.forEach((applicationRole: IApplicationRole) => {
      applicationRole.fromDate = applicationRole.fromDate != null ? new Date(applicationRole.fromDate) : null;
      applicationRole.thruDate = applicationRole.thruDate != null ? new Date(applicationRole.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IApplicationRole) {
    console.log('entity at preSave : ', entity);
  }
}
