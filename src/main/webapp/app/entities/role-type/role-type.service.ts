import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRoleType } from './role-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class RoleTypeService extends AbstractEntityService<IRoleType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/role-types');
  }

  protected isNew(entity: IRoleType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IRoleType) {}
}
