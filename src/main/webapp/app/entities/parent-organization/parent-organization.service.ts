import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IParentOrganization } from './parent-organization.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ParentOrganizationService extends AbstractEntityService<IParentOrganization> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/parent-organizations');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/parent-organizations');
  }

  protected isNew(entity: IParentOrganization): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IParentOrganization) {}
}
