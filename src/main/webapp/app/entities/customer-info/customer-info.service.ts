import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICustomerInfo } from './customer-info.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class CustomerInfoService extends AbstractEntityService<ICustomerInfo> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/customer-infos');
  }

  protected isNew(entity: ICustomerInfo): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: ICustomerInfo) {}
}
