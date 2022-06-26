import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAccountTransCategory } from './account-trans-category.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class AccountTransCategoryService extends AbstractEntityService<IAccountTransCategory> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/account-trans-categories');
  }

  protected isNew(entity: IAccountTransCategory): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IAccountTransCategory) {}
}
