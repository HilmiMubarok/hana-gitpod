import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyRole } from './party-role.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PartyRoleService extends AbstractEntityService<IPartyRole> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/party-roles');
  }

  protected isNew(entity: IPartyRole): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IPartyRole>): HttpResponse<IPartyRole> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IPartyRole[]>): HttpResponse<IPartyRole[]> {
    res.body.forEach((partyRole: IPartyRole) => {
      partyRole.fromDate = partyRole.fromDate != null ? new Date(partyRole.fromDate) : null;
      partyRole.thruDate = partyRole.thruDate != null ? new Date(partyRole.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IPartyRole) {}
}
