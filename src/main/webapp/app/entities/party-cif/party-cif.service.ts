import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyCif } from './party-cif.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PartyCifService extends AbstractEntityService<IPartyCif> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/party-cifs');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/party-cifs');
  }

  protected isNew(entity: IPartyCif): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartyCif) {}

  public findLikeCif(cif: string, req: any): Observable<HttpResponse<IPartyCif[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPartyCif[]>(this.resourceUrl + '/cif/like/' + cif, { params: options, observe: 'response' });
  }
}
