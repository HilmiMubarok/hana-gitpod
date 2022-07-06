import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IStatusItem } from './status-item.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class StatusItemService extends AbstractEntityService<IStatusItem> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/status-items');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/status-items');
  }

  protected isNew(entity: IStatusItem): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IStatusItem) {}
}
