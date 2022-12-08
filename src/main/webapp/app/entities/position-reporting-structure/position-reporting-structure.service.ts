import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPositionReportingStructure } from './position-reporting-structure.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class PositionReportingStructureService extends AbstractEntityService<IPositionReportingStructure> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/position-reporting-structures');
  }

  protected isNew(entity: IPositionReportingStructure): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IPositionReportingStructure>): HttpResponse<IPositionReportingStructure> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IPositionReportingStructure[]>): HttpResponse<IPositionReportingStructure[]> {
    res.body.forEach((positionReportingStructure: IPositionReportingStructure) => {
      positionReportingStructure.fromDate =
        positionReportingStructure.fromDate != null ? new Date(positionReportingStructure.fromDate) : null;
      positionReportingStructure.thruDate =
        positionReportingStructure.thruDate != null ? new Date(positionReportingStructure.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IPositionReportingStructure) {}
}
