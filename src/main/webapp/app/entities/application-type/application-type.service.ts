import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IApplicationType } from './application-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ApplicationTypeService extends AbstractEntityService<IApplicationType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/application-types');
  }

  protected isNew(entity: IApplicationType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IApplicationType) {}
}
