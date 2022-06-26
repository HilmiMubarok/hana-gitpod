import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IInternalType } from './internal-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class InternalTypeService extends AbstractEntityService<IInternalType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/internal-types');
  }

  protected isNew(entity: IInternalType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IInternalType) {}
}
