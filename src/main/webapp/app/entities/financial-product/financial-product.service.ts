import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFinancialProduct } from './financial-product.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class FinancialProductService extends AbstractEntityService<IFinancialProduct> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/financial-products');
  }

  protected isNew(entity: IFinancialProduct): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IFinancialProduct>): HttpResponse<IFinancialProduct> {
    res.body.introDate = res.body.introDate != null ? new Date(res.body.introDate) : null;
    res.body.discontinueDate = res.body.discontinueDate != null ? new Date(res.body.discontinueDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IFinancialProduct[]>): HttpResponse<IFinancialProduct[]> {
    res.body.forEach((financialProduct: IFinancialProduct) => {
      financialProduct.introDate = financialProduct.introDate != null ? new Date(financialProduct.introDate) : null;
      financialProduct.discontinueDate = financialProduct.discontinueDate != null ? new Date(financialProduct.discontinueDate) : null;
    });
    return res;
  }

  protected preSave(entity: IFinancialProduct) {}
}
