import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISurveyor } from './surveyor.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class SurveyorService extends AbstractEntityService<ISurveyor> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/surveyors');
  }

  protected isNew(entity: ISurveyor): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ISurveyor>): HttpResponse<ISurveyor> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ISurveyor[]>): HttpResponse<ISurveyor[]> {
    res.body.forEach((surveyor: ISurveyor) => {
      surveyor.fromDate = surveyor.fromDate != null ? new Date(surveyor.fromDate) : null;
      surveyor.thruDate = surveyor.thruDate != null ? new Date(surveyor.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: ISurveyor) {}
}
