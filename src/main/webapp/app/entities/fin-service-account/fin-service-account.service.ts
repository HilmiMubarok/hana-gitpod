import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFinServiceAccount } from './fin-service-account.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class FinServiceAccountService extends AbstractEntityService<IFinServiceAccount> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/fin-service-accounts');
  }

  protected isNew(entity: IFinServiceAccount): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IFinServiceAccount) {}
}
