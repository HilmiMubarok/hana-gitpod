import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRelationType } from './relation-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class RelationTypeService extends AbstractEntityService<IRelationType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/relation-types');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/relation-types');
  }

  protected isNew(entity: IRelationType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IRelationType) {}
}
