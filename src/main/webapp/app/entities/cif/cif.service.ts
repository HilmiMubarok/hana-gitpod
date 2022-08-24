import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICif } from './cif.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class CifService extends AbstractEntityService<ICif> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/cifs');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/cifs');
  }

  protected isNew(entity: ICif): boolean {
    return entity.id === undefined || entity.id === null;
  }

  preSave(entity: ICif) {
    this.http.post<ICif[]>(this.resourceUrl, entity).subscribe(response => alert('success'));
  }
}
