import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductCategory } from './product-category.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService extends AbstractEntityService<IProductCategory> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/product-categories');
  }

  protected isNew(entity: IProductCategory): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IProductCategory) {}
}
