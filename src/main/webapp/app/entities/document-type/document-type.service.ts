import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IDocumentType } from './document-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentTypeService extends AbstractEntityService<IDocumentType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/document-types');
  }

  public documentType() {
    return this.http.get<IDocumentType[]>(`${this.resourceUrl}}`, { observe: 'response' });
  }
  public documentTypeList(perentId: string) {
    return this.http.get<IDocumentType[]>(`${this.resourceUrl}/list-active/${perentId}`, { observe: 'response' });
  }
}
