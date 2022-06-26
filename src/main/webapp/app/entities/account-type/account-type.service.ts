import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAccountType } from './account-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class AccountTypeService extends AbstractEntityService<IAccountType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/account-types');
  }

  protected isNew(entity: IAccountType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IAccountType) {}
}
