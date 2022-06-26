import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFeatureApplicable } from './feature-applicable.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class FeatureApplicableService extends AbstractEntityService<IFeatureApplicable> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/feature-applicables');
  }

  protected isNew(entity: IFeatureApplicable): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IFeatureApplicable>): HttpResponse<IFeatureApplicable> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IFeatureApplicable[]>): HttpResponse<IFeatureApplicable[]> {
    res.body.forEach((featureApplicable: IFeatureApplicable) => {
      featureApplicable.fromDate = featureApplicable.fromDate != null ? new Date(featureApplicable.fromDate) : null;
      featureApplicable.thruDate = featureApplicable.thruDate != null ? new Date(featureApplicable.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IFeatureApplicable) {}
}
