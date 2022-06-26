import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUom } from './uom.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class UomService extends AbstractEntityService<IUom> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/uoms');
  }

  protected isNew(entity: IUom): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IUom) {}
}
