import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IServiceProduct } from './service-product.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class ServiceProductService extends AbstractEntityService<IServiceProduct> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/service-products');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/service-products');
  }

  protected isNew(entity: IServiceProduct): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IServiceProduct>): HttpResponse<IServiceProduct> {
    res.body.introDate = res.body.introDate != null ? new Date(res.body.introDate) : null;
    res.body.discontinueDate = res.body.discontinueDate != null ? new Date(res.body.discontinueDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IServiceProduct[]>): HttpResponse<IServiceProduct[]> {
    res.body.forEach((serviceProduct: IServiceProduct) => {
      serviceProduct.introDate = serviceProduct.introDate != null ? new Date(serviceProduct.introDate) : null;
      serviceProduct.discontinueDate = serviceProduct.discontinueDate != null ? new Date(serviceProduct.discontinueDate) : null;
    });
    return res;
  }

  protected preSave(entity: IServiceProduct) {}
}
