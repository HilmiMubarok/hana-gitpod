import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IApplicationProduct } from './application-product.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ApplicationProductService extends AbstractEntityService<IApplicationProduct> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/application-products');
  }

  protected isNew(entity: IApplicationProduct): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IApplicationProduct) {}
}
