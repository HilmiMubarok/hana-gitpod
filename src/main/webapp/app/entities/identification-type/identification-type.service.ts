import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IIdentificationType } from './identification-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class IdentificationTypeService extends AbstractEntityService<IIdentificationType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/identification-types');
  }

  protected isNew(entity: IIdentificationType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IIdentificationType) {}
}
