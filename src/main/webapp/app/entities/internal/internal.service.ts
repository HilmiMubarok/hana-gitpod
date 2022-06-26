import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IInternal } from './internal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class InternalService extends AbstractEntityService<IInternal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/internals');
  }

  protected isNew(entity: IInternal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IInternal) {}
}
