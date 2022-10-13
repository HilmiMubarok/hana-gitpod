import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IOrganizationLegal } from './organization-legal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class OrganizationLegalService extends AbstractEntityService<IOrganizationLegal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/organization-legals');
  }

  protected isNew(entity: IOrganizationLegal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IOrganizationLegal>): HttpResponse<IOrganizationLegal> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IOrganizationLegal[]>): HttpResponse<IOrganizationLegal[]> {
    res.body.forEach((organizationLegal: IOrganizationLegal) => {
      organizationLegal.fromDate = organizationLegal.fromDate != null ? new Date(organizationLegal.fromDate) : null;
      organizationLegal.thruDate = organizationLegal.thruDate != null ? new Date(organizationLegal.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IOrganizationLegal) {}
}
