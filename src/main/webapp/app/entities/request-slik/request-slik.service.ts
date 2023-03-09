import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRequestSlik } from './request-slik.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class RequestSlikService extends AbstractEntityService<IRequestSlik> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/request-sliks');
  }

  protected isNew(entity: IRequestSlik): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IRequestSlik) {}
}
