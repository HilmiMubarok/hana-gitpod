import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPosition } from './position.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PositionService extends AbstractEntityService<IPosition> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/positions');
  }

  protected isNew(entity: IPosition): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public findByLogin(): Observable<HttpResponse<IPosition>> {
    return this.http.get<IPosition>(this.resourceUrl + '/get-by-login/', { observe: 'response' });
  }

  protected preSave(entity: IPosition) {}
}
