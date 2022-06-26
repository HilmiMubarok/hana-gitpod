import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IGoodIdentification } from './good-identification.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class GoodIdentificationService extends AbstractEntityService<IGoodIdentification> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/good-identifications');
  }

  protected isNew(entity: IGoodIdentification): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IGoodIdentification) {}
}
