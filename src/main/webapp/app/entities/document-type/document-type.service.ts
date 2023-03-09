import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IDocumentType } from './document-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class DocumentTypeService extends AbstractEntityService<IDocumentType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/document-types');
  }

  protected isNew(entity: IDocumentType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IDocumentType) {}
}
