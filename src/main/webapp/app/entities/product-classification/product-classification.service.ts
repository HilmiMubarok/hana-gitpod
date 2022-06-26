import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductClassification } from './product-classification.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class ProductClassificationService extends AbstractEntityService<IProductClassification> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/product-classifications');
  }

  protected isNew(entity: IProductClassification): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IProductClassification>): HttpResponse<IProductClassification> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IProductClassification[]>): HttpResponse<IProductClassification[]> {
    res.body.forEach((productClassification: IProductClassification) => {
      productClassification.fromDate = productClassification.fromDate != null ? new Date(productClassification.fromDate) : null;
      productClassification.thruDate = productClassification.thruDate != null ? new Date(productClassification.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IProductClassification) {}
}
