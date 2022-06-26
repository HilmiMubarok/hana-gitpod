import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPurposeType } from './purpose-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PurposeTypeService extends AbstractEntityService<IPurposeType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/purpose-types');
  }

  protected isNew(entity: IPurposeType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPurposeType) {}
}
