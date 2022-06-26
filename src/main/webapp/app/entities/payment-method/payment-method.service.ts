import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPaymentMethod } from './payment-method.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService extends AbstractEntityService<IPaymentMethod> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/payment-methods');
  }

  protected isNew(entity: IPaymentMethod): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IPaymentMethod>): HttpResponse<IPaymentMethod> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IPaymentMethod[]>): HttpResponse<IPaymentMethod[]> {
    res.body.forEach((paymentMethod: IPaymentMethod) => {
      paymentMethod.fromDate = paymentMethod.fromDate != null ? new Date(paymentMethod.fromDate) : null;
      paymentMethod.thruDate = paymentMethod.thruDate != null ? new Date(paymentMethod.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IPaymentMethod) {}
}
