import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISurveyBatch } from './survey-batch.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class SurveyBatchService extends AbstractEntityService<ISurveyBatch> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/survey-batches');
  }

  protected isNew(entity: ISurveyBatch): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ISurveyBatch>): HttpResponse<ISurveyBatch> {
    res.body.receivedDate = res.body.receivedDate != null ? new Date(res.body.receivedDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ISurveyBatch[]>): HttpResponse<ISurveyBatch[]> {
    res.body.forEach((surveyBatch: ISurveyBatch) => {
      surveyBatch.receivedDate = surveyBatch.receivedDate != null ? new Date(surveyBatch.receivedDate) : null;
    });
    return res;
  }

  protected preSave(entity: ISurveyBatch) {}
}
