import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPeriod } from './period.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PeriodService extends AbstractEntityService<IPeriod> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/periods');
  }

  protected isNew(entity: IPeriod): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPeriod) {}
}
