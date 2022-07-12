import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IDebtorData } from './debtor-data.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class DebtorDataService extends AbstractEntityService<IDebtorData> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/debtor-data');
  }

  protected isNew(entity: IDebtorData): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IDebtorData) {}
}
