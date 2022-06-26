import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUomType } from './uom-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class UomTypeService extends AbstractEntityService<IUomType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/uom-types');
  }

  protected isNew(entity: IUomType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IUomType) {}
}
