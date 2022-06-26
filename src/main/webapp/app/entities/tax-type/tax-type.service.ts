import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ITaxType } from './tax-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class TaxTypeService extends AbstractEntityService<ITaxType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/tax-types');
  }

  protected isNew(entity: ITaxType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: ITaxType) {}
}
