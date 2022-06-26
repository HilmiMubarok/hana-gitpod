import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPaymentApplication } from './payment-application.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PaymentApplicationService extends AbstractEntityService<IPaymentApplication> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/payment-applications');
  }

  protected isNew(entity: IPaymentApplication): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPaymentApplication) {}
}
