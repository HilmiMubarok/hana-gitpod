import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPeriodType } from './period-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PeriodTypeService extends AbstractEntityService<IPeriodType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/period-types');
  }

  protected isNew(entity: IPeriodType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPeriodType) {}
}
