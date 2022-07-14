import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IOrganizationFinancial } from './organization-financial.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class OrganizationFinancialService extends AbstractEntityService<IOrganizationFinancial> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/services/los/api/organization-financials');
  }

  protected isNew(entity: IOrganizationFinancial): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IOrganizationFinancial>): HttpResponse<IOrganizationFinancial> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IOrganizationFinancial[]>): HttpResponse<IOrganizationFinancial[]> {
    res.body.forEach((organizationFinancial: IOrganizationFinancial) => {
      organizationFinancial.fromDate = organizationFinancial.fromDate != null ? new Date(organizationFinancial.fromDate) : null;
      organizationFinancial.thruDate = organizationFinancial.thruDate != null ? new Date(organizationFinancial.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IOrganizationFinancial) {}
}
