import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IApplicationOption } from './application-option.model';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class ApplicationOptionService extends AbstractEntityService<IApplicationOption> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/application-options');
  }

  protected isNew(entity: IApplicationOption): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IApplicationOption) {}
}
