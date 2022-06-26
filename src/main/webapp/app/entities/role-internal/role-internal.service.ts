import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRoleInternal } from './role-internal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class RoleInternalService extends AbstractEntityService<IRoleInternal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/role-internals');
  }

  protected isNew(entity: IRoleInternal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IRoleInternal>): HttpResponse<IRoleInternal> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IRoleInternal[]>): HttpResponse<IRoleInternal[]> {
    res.body.forEach((roleInternal: IRoleInternal) => {
      roleInternal.fromDate = roleInternal.fromDate != null ? new Date(roleInternal.fromDate) : null;
      roleInternal.thruDate = roleInternal.thruDate != null ? new Date(roleInternal.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IRoleInternal) {}
}
