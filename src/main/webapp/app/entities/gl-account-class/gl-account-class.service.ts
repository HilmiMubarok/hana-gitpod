import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IGLAccountClass } from './gl-account-class.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class GLAccountClassService extends AbstractEntityService<IGLAccountClass> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/gl-account-classes');
  }

  protected isNew(entity: IGLAccountClass): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IGLAccountClass) {}
}
