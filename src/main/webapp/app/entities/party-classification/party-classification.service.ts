import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyClassification } from './party-classification.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PartyClassificationService extends AbstractEntityService<IPartyClassification> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/party-classifications');
  }

  protected isNew(entity: IPartyClassification): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IPartyClassification>): HttpResponse<IPartyClassification> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IPartyClassification[]>): HttpResponse<IPartyClassification[]> {
    res.body.forEach((partyClassification: IPartyClassification) => {
      partyClassification.fromDate = partyClassification.fromDate != null ? new Date(partyClassification.fromDate) : null;
      partyClassification.thruDate = partyClassification.thruDate != null ? new Date(partyClassification.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IPartyClassification) {}
}
