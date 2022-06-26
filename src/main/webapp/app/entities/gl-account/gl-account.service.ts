import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IGLAccount } from './gl-account.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class GLAccountService extends AbstractEntityService<IGLAccount> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/gl-accounts');
  }

  protected isNew(entity: IGLAccount): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IGLAccount) {}
}
