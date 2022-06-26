import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductCategoryType } from './product-category-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ProductCategoryTypeService extends AbstractEntityService<IProductCategoryType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/product-category-types');
  }

  protected isNew(entity: IProductCategoryType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IProductCategoryType) {}
}
