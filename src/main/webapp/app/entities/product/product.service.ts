import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProduct } from './product.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class ProductService extends AbstractEntityService<IProduct> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/products');
  }

  protected isNew(entity: IProduct): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IProduct>): HttpResponse<IProduct> {
    res.body.introDate = res.body.introDate != null ? new Date(res.body.introDate) : null;
    res.body.discontinueDate = res.body.discontinueDate != null ? new Date(res.body.discontinueDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IProduct[]>): HttpResponse<IProduct[]> {
    res.body.forEach((product: IProduct) => {
      product.introDate = product.introDate != null ? new Date(product.introDate) : null;
      product.discontinueDate = product.discontinueDate != null ? new Date(product.discontinueDate) : null;
    });
    return res;
  }

  protected preSave(entity: IProduct) {}
}
