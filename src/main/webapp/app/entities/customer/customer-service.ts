import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICustomer } from './customer.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class CustomerInfoService extends AbstractEntityService<ICustomer> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/mastercontrol/api/people');
  }

  protected isNew(entity: ICustomer): boolean {
    return entity.id === undefined || entity.id === null;
  }

  preSave(entity: ICustomer) {}
}
