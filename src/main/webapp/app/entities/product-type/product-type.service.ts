import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductType } from './product-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ProductTypeService extends AbstractEntityService<IProductType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/product-types');
  }

  protected isNew(entity: IProductType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IProductType) {}
}
