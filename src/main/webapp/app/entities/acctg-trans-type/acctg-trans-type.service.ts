import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAcctgTransType } from './acctg-trans-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class AcctgTransTypeService extends AbstractEntityService<IAcctgTransType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/acctg-trans-types');
  }

  protected isNew(entity: IAcctgTransType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IAcctgTransType) {}
}
