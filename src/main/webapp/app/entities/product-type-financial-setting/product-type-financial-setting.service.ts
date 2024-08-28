import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductTypeFinancialSetting } from './product-type-financial-setting.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ProductTypeFinancialSettingService extends AbstractEntityService<IProductTypeFinancialSetting> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/product-type-financial-settings');
  }

  protected isNew(entity: IProductTypeFinancialSetting): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IProductTypeFinancialSetting) {}
}
