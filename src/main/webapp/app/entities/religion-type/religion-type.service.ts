import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IReligionType } from './religion-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ReligionTypeService extends AbstractEntityService<IReligionType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/religion-types');
  }

  protected isNew(entity: IReligionType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IReligionType) {}
}
