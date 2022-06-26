import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IAcctgTransItem } from './acctg-trans-item.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class AcctgTransItemService extends AbstractEntityService<IAcctgTransItem> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/acctg-trans-items');
  }

  protected isNew(entity: IAcctgTransItem): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IAcctgTransItem) {}
}
