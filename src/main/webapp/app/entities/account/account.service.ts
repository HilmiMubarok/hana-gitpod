import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAccount } from './account.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class AccountService extends AbstractEntityService<IAccount> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/accounts');
  }

  protected isNew(entity: IAccount): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IAccount) {}
}
