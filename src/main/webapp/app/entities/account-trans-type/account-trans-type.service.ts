import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAccountTransType } from './account-trans-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class AccountTransTypeService extends AbstractEntityService<IAccountTransType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/account-trans-types');
  }

  protected isNew(entity: IAccountTransType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IAccountTransType) {}
}
