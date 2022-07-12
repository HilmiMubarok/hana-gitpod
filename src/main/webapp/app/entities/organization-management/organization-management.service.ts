import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IOrganizationManagement } from './organization-management.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({
  providedIn: 'root',
})
export class OrganizationManagementService extends AbstractEntityService<IOrganizationManagement> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/organization-managements');
  }

  protected isNew(entity: IOrganizationManagement): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IOrganizationManagement>): HttpResponse<IOrganizationManagement> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IOrganizationManagement[]>): HttpResponse<IOrganizationManagement[]> {
    res.body.forEach((organizationManagement: IOrganizationManagement) => {
      organizationManagement.fromDate = organizationManagement.fromDate != null ? new Date(organizationManagement.fromDate) : null;
      organizationManagement.thruDate = organizationManagement.thruDate != null ? new Date(organizationManagement.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IOrganizationManagement) {}
}
