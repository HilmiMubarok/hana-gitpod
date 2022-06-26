import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRoleVendor } from './role-vendor.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class RoleVendorService extends AbstractEntityService<IRoleVendor> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/role-vendors');
  }

  protected isNew(entity: IRoleVendor): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IRoleVendor>): HttpResponse<IRoleVendor> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IRoleVendor[]>): HttpResponse<IRoleVendor[]> {
    res.body.forEach((roleVendor: IRoleVendor) => {
      roleVendor.fromDate = roleVendor.fromDate != null ? new Date(roleVendor.fromDate) : null;
      roleVendor.thruDate = roleVendor.thruDate != null ? new Date(roleVendor.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IRoleVendor) {}
}
