import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductTypeConfig } from './product-type-config.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ProductTypeConfigService extends AbstractEntityService<IProductTypeConfig> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/product-type-configs');
  }

  protected isNew(entity: IProductTypeConfig): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IProductTypeConfig) {
  }
}
