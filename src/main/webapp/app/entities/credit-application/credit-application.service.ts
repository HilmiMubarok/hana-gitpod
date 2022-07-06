import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditApplication } from './credit-application.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class CreditApplicationService extends AbstractEntityService<ICreditApplication> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-applications');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/credit-applications');
  }

  protected isNew(entity: ICreditApplication): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: ICreditApplication) {}
}
