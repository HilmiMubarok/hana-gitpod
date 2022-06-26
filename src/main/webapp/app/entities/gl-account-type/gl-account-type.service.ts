import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IGLAccountType } from './gl-account-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class GLAccountTypeService extends AbstractEntityService<IGLAccountType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/gl-account-types');
  }

  protected isNew(entity: IGLAccountType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IGLAccountType) {}
}
