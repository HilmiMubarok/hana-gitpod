import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISettlementType } from './settlement-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class SettlementTypeService extends AbstractEntityService<ISettlementType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/settlement-types');
  }

  protected isNew(entity: ISettlementType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: ISettlementType) {}
}
