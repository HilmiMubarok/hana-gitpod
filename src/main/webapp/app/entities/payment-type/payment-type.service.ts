import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPaymentType } from './payment-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PaymentTypeService extends AbstractEntityService<IPaymentType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/payment-types');
  }

  protected isNew(entity: IPaymentType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPaymentType) {}
}
