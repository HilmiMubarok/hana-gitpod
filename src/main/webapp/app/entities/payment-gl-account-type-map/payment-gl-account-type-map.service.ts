import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPaymentGLAccountTypeMap } from './payment-gl-account-type-map.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PaymentGLAccountTypeMapService extends AbstractEntityService<IPaymentGLAccountTypeMap> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/payment-gl-account-type-maps');
  }

  protected isNew(entity: IPaymentGLAccountTypeMap): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPaymentGLAccountTypeMap) {}
}
