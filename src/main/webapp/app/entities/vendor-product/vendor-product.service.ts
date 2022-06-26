import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IVendorProduct } from './vendor-product.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class VendorProductService extends AbstractEntityService<IVendorProduct> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/vendor-products');
  }

  protected isNew(entity: IVendorProduct): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IVendorProduct>): HttpResponse<IVendorProduct> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IVendorProduct[]>): HttpResponse<IVendorProduct[]> {
    res.body.forEach((vendorProduct: IVendorProduct) => {
      vendorProduct.fromDate = vendorProduct.fromDate != null ? new Date(vendorProduct.fromDate) : null;
      vendorProduct.thruDate = vendorProduct.thruDate != null ? new Date(vendorProduct.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IVendorProduct) {}
}
